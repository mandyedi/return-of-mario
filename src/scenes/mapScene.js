import createPlayer from '../player.js';
import createEnemies from '../enemy.js';
import { rectIntersectsRect, intersectionSide } from '../rect.js';
import hud from '../hud.js';

let canvas = kontra.getCanvas();

// TODO: refactor enemy collision test
//       use refine collision (player's solution)
//       move it into enemy
function testEnemyCollisionWithGroundLayer(sprite, tileEngine) {
    // Calculate tile type next to player
    // If tile type biger then zerom there is a collision
    let tilePosPlayer   = kontra.Vector(sprite.x / tileEngine.tilewidth | 0, sprite.y / tileEngine.tileheight | 0);
    let tilePosRight    = kontra.Vector(tilePosPlayer.x + 1, tilePosPlayer.y);
    let tilePosBottom   = kontra.Vector(tilePosPlayer.x, tilePosPlayer.y + 1);
    let tilePosDiag     = kontra.Vector(tilePosPlayer.x + 1, tilePosPlayer.y + 1);
    let tileTypePlayer  = tileEngine.tileAtLayer('ground', {row: tilePosPlayer.y, col: tilePosPlayer.x});
    let tileTypeRight   = tileEngine.tileAtLayer('ground', {row: tilePosRight.y, col: tilePosRight.x});
    let tileTypeBottom  = tileEngine.tileAtLayer('ground', {row: tilePosBottom.y, col: tilePosBottom.x});
    let tileTypeDiag    = tileEngine.tileAtLayer('ground', {row: tilePosDiag.y, col: tilePosDiag.x});;

    // Check vertically if there is a collision
    if (sprite.dy > 0) {
        if (tileTypeBottom || (tileTypeDiag && !tileTypeRight)) {
            sprite.y = (tilePosBottom.y - 1 ) * tileEngine.tileheight;
            sprite.dy = 0;
            sprite.ddy = 0;
        }
    }

    // Check horizontally if there is a collision
    if (sprite.dx > 0) {
        if (tileTypeRight && !tileTypePlayer) {
            sprite.x = tilePosPlayer.x * tileEngine.tilewidth;
            sprite.dx = 0
            sprite.speed = -sprite.speed;
        }
    }
    else if (sprite.dx < 0) {
        if (tileTypePlayer && !tileTypeRight) {
            sprite.x = (tilePosPlayer.x + 1) * tileEngine.tilewidth;
            sprite.dx = 0;
            sprite.speed = -sprite.speed;
        }
    }
}

let mapScene = kontra.Scene({
    id: 'map',
    gameOver: false,
    timer: 0,
    tileEngine: undefined,
    brick: undefined,
    enemies: undefined,
    player: undefined,
    earth: undefined,

    onShow: function() {
        this.gameOver = false;
        this.timer = 0;
        let mapAsset = kontra.dataAssets['assets/map'];
        this.tileEngine = kontra.TileEngine(mapAsset);
        this.tileEngine.sx = 0;
        this.tileEngine.sy = 0;

        hud.reset();

        this.tileEngine.properties.map(property => {
            if (property.name == 'name') {
                hud.updateWorld(property.value);
            }
        });

        let brickSpriteSheet = kontra.SpriteSheet({
            image: kontra.imageAssets['assets/brick_animation'],
            frameWidth: 96,
            frameHeight: 96,
            animations: {
              destroy: {
                frames: '0..4',
                frameRate: 10,
                loop: false
              }
            }
        });
        this.brick = kontra.Sprite({
            x: 1000,
            y: 0,
            animations: brickSpriteSheet.animations
        });
        this.tileEngine.addObject(this.brick);

        this.enemies = createEnemies(this.tileEngine);
        this.enemies.map( enemy => this.tileEngine.addObject(enemy));

        this.player = createPlayer(this.tileEngine, this.brick, hud);
        this.tileEngine.addObject(this.player);
        
        this.earth = kontra.Sprite({
            x: 500,
            y: 100,
            width: 128,
            height: 69,
            image: kontra.imageAssets['assets/earth']
        });
    },

    update: function(dt) {
        if (this.gameOver) {
            // TODO: game over animation
            if (this.timer > 3) {
                kontra.emit('navigate', 'over');
            }
            this.timer += dt;
        }
        else {
            if (this.timer > 400) {
                kontra.emit('navigate', 'over');
            }
            this.timer += dt;

            this.player.update(dt);

            this.enemies.map(enemy => {
                if (enemy.active == true) {
                    enemy.update(dt);
                    testEnemyCollisionWithGroundLayer(enemy, this.tileEngine);

                    let rectPlayer = this.player.getRect();
                    let rectEnemy = enemy.getRect();
                    if (rectIntersectsRect(rectPlayer, rectEnemy)) {
                        if (intersectionSide(rectPlayer, rectEnemy) == 'top') {
                            enemy.ttl = 0;
                            this.player.ddy -= 950 * dt;  // jump impulse
                            this.player.jumping = true;
                            this.player.advance();
                            hud.updatePoints(100);
                        }
                        else {
                            this.timer = 0;
                            this.gameOver = true;
                        }
                        
                    }
                }
                else if (enemy.active == false && this.tileEngine.sx + canvas.width >= enemy.x) {
                    enemy.active = true;
                }
            });

            if (this.player.y + this.player.height >= this.tileEngine.tileheight * this.tileEngine.height) {
                this.timer = 0;
                this.gameOver = true;
            }

            this.brick.update();

            hud.update(dt);
        }
    },

    render: function() {
        this.earth.render();

        this.tileEngine.renderLayer("ground");
        this.tileEngine.renderLayer("background");
        this.player.render();

        this.enemies = this.enemies.filter(enemy => enemy.isAlive());
        this.enemies.map(enemy => enemy.render());

        this.brick.render();

        hud.render();
    }
});

export default mapScene;