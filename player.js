export default function createPlayer(tileEngine) {
    let canvas = kontra.getCanvas();

    let player = kontra.Sprite({
        x: canvas.width / 2 - 32,
        y: 576,
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
        falling: false,

        update(dt) {
            this.dx = 0;
            this.ddy = 64 * dt; // gravity

            let speed = 512 * dt;
            if(kontra.keyPressed('right')) {
                this.dx = speed;
            }
            if(kontra.keyPressed('left')) {
                this.dx = -speed;
            }

            if(kontra.keyPressed('up') && !this.jumping && !this.falling) {
                this.ddy -= 1450 * dt;  // jump impulse
                this.jumping = true;
            }

            // TODO: clamp dx, dy
            this.advance();
            
            // Calculate tile type next to player
            // If tile type biger then zerom there is a collision
            let tilePosPlayer   = kontra.Vector(this.x / tileEngine.tilewidth | 0, this.y / tileEngine.tileheight | 0);
            let tilePosRight    = kontra.Vector(tilePosPlayer.x + 1, tilePosPlayer.y);
            let tilePosBottom   = kontra.Vector(tilePosPlayer.x, tilePosPlayer.y + 2);
            let tilePosDiag     = kontra.Vector(tilePosPlayer.x + 1, tilePosPlayer.y + 2);
            let tileTypePlayer  = tileEngine.tileAtLayer('groundLayer', {row: tilePosPlayer.y, col: tilePosPlayer.x});
            tileTypePlayer     += tileEngine.tileAtLayer('groundLayer', {row: tilePosPlayer.y + 1, col: tilePosPlayer.x});
            let tileTypeRight   = tileEngine.tileAtLayer('groundLayer', {row: tilePosRight.y, col: tilePosRight.x});
            tileTypeRight      += tileEngine.tileAtLayer('groundLayer', {row: tilePosRight.y + 1, col: tilePosRight.x});
            let tileTypeBottom  = tileEngine.tileAtLayer('groundLayer', {row: tilePosBottom.y, col: tilePosBottom.x});
            let tileTypeDiag    = tileEngine.tileAtLayer('groundLayer', {row: tilePosDiag.y, col: tilePosDiag.x});;

            // Check vertically if there is a collision
            if (this.dy > 0) {
                if (tileTypeBottom || (tileTypeDiag && !tileTypeRight)) {
                    this.y = (tilePosBottom.y - 2 ) * tileEngine.tileheight;
                    this.dy = 0;
                    this.ddy = 0;
                    this.falling = false;
                    this.jumping = false;
                }
            }
            else if (this.dy < 0) {
                if ((tileTypePlayer && !tileTypeBottom) || (tileTypeRight && !tileTypeDiag)) {
                    this.y = (tilePosPlayer.y + 1) * tileEngine.tileheight;
                    this.dy = 0;
                    // TODO: Original implementation had 1x1 tile for player, not sure if this is going to work with 1x2 player
                    tileTypePlayer = tileTypeBottom;
                    tileTypeRight = tileTypeDiag;
                }
            }

            // Check horizontally if there is a collision
            if (this.dx > 0) {
                if (tileTypeRight && !tileTypePlayer) {
                    this.x = tilePosPlayer.x * tileEngine.tilewidth;
                    this.dx = 0;
                }
                else if (this.x > canvas.width / 2) {
                    tileEngine.sx += speed;
                }
            }
            else if (this.dx < 0) {
                if (tileTypePlayer && !tileTypeRight) {
                    this.x = (tilePosPlayer.x + 1) * tileEngine.tilewidth;
                    this.dx = 0;
                }
                // Prevent player go back to left
                if (this.x < tileEngine.sx) {
                    this.x = tileEngine.sx;
                    this.dx = 0;
                }
            }         
        }
    });

    return player;
}
