import { Rect, rectIntersection, rectIntersectsRect } from './rect.js';

export default function createPlayer(tileEngine) {
    let canvas = kontra.getCanvas();

    let playerObject = tileEngine.layerMap['player'].objects[0];

    let player = kontra.Sprite({
        x: playerObject.x,
        y: playerObject.y,
        width:64,
        height: 128,
        
        // Velocity
        dx: 0,
        dy: 0,
        // Acceleration
        ddx: 0,
        ddy: 0,

        image: kontra.imageAssets['assets/player_big'],

        // Custom paramteres
        jumping: false,

        getRect() {
            return new Rect(this.x, this.y, this.width, this.height);
        },

        update(dt) {
            this.dx = 0;
            this.ddy = 64 * dt; // gravity

            let speed = 512 * dt;
            if(kontra.keyPressed('right')) {
                this.dx = speed;
                if (this.x > canvas.width / 2) {
                    tileEngine.sx += speed;
                }
            }
            if(kontra.keyPressed('left')) {
                this.dx = -speed;
            }

            if(kontra.keyPressed('up') && !this.jumping) {
                this.ddy -= 1450 * dt;  // jump impulse
                this.jumping = true;
            }

            this.advance();

            // Check and resolve collision
            let playerRect = new Rect(player.x, player.y, player.width, player.height);
            let playerCoord = kontra.Vector(this.x / tileEngine.tilewidth | 0, this.y / tileEngine.tileheight | 0);
            let indices = [4, 0, 2, 3, 1, 5];
            for (let i = 0; i < 6; i++) {
                let tileIndex = indices[i];

                let tileColumn = tileIndex % 2;
                let tileRow = tileIndex / 2 | 0;
                let tileCoord = kontra.Vector(playerCoord.x + tileColumn, playerCoord.y + tileRow);
                let gid = tileEngine.tileAtLayer('groundLayer', {row: tileCoord.y, col: tileCoord.x});

                if (gid != 0) {
                    let tileRect = new Rect(
                        tileCoord.x * tileEngine.tilewidth,
                        tileCoord.y * tileEngine.tileheight,
                        tileEngine.tilewidth,
                        tileEngine.tileheight );

                    if (rectIntersectsRect(playerRect, tileRect)) {
                        let intersection = rectIntersection(playerRect, tileRect);
                        
                        if (tileIndex == 2) {
                            // Tile is left
                            this.x += intersection.width;
                        }
                        else if (tileIndex == 3) {
                            // Tile is right
                            this.x -= intersection.width;
                        }
                        else {
                            if (intersection.width > intersection.height) {
                                // Intersection happens below or above
                                this.dy = 0;
                                if (tileIndex > 3) {
                                    this.jumping = false;
                                    this.y -= intersection.height;
                                }
                                else {
                                    this.y += intersection.height;
                                }
                            }
                            else {
                                // Intersection happens left or right
                                if (tileIndex == 0 || tileIndex == 4) {
                                    this.x += intersection.width;
                                }
                                else {
                                    this.x -= intersection.width;
                                }
                            }
                        }
                    }
                }
            }

            // Prevent player go back to left
            if (this.x < tileEngine.sx) {
                this.x = tileEngine.sx;
                this.dx = 0;
            }     
        }
    });

    return player;
}
