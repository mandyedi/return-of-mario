/*
TODO:

Add spritesheet for player and entities.

Destroy tiles.

Tiles with items.

PLayer states: small and big.

Tube takes the player to bonus level.

Add trigger option to enemies: enemy start moving when appears in the canvas.

Use Kontra scene.
Welcome scene, game scene, game over scene.
Scene also has cullObjects feature but need to look up that how it affects the enemy trigger feature.

Game over.
Times up, player falls, collides with enemy.

HUD (Heads Up Display).
Score, coins, world, time, lives.

Draw own graphics.

Build full level.
*/

kontra.init();
kontra.initKeys();

let canvas = kontra.getCanvas();

import createPlayer from './player.js';
import createEnemies from './enemy.js';
import createDebugGrid from './debug.js';
import { rectIntersectsRect, intersectionSide } from './rect.js';

// Setup asset load
let numAssets = 1;
let assetsLoaded = 0;
kontra.on('assetLoaded', (asset, url) => {
    assetsLoaded++;
    console.log("asset loaded: " + url);
    // TODO: Inform user, udate progress bar
});

kontra.load(
    'assets/tiles.png',
    'assets/map_tileset.json',
    'assets/map.json',
    'assets/player_big.png',
    'assets/enemy1.png',
    'assets/enemy2.png'
).then(assets => {
    // TODO: all assets have loaded
    startGame();
}).catch(err => {
    console.log("Error: " + err);
    // TODO: handle error
});

// TODO: refactor
// Use refine collision (player's solution)
// Move it into enemy
function testEnemyCollisionWithGroundLayer(sprite, tileEngine) {
    // Calculate tile type next to player
    // If tile type biger then zerom there is a collision
    let tilePosPlayer   = kontra.Vector(sprite.x / tileEngine.tilewidth | 0, sprite.y / tileEngine.tileheight | 0);
    let tilePosRight    = kontra.Vector(tilePosPlayer.x + 1, tilePosPlayer.y);
    let tilePosBottom   = kontra.Vector(tilePosPlayer.x, tilePosPlayer.y + 1);
    let tilePosDiag     = kontra.Vector(tilePosPlayer.x + 1, tilePosPlayer.y + 1);
    let tileTypePlayer  = tileEngine.tileAtLayer('groundLayer', {row: tilePosPlayer.y, col: tilePosPlayer.x});
    let tileTypeRight   = tileEngine.tileAtLayer('groundLayer', {row: tilePosRight.y, col: tilePosRight.x});
    let tileTypeBottom  = tileEngine.tileAtLayer('groundLayer', {row: tilePosBottom.y, col: tilePosBottom.x});
    let tileTypeDiag    = tileEngine.tileAtLayer('groundLayer', {row: tilePosDiag.y, col: tilePosDiag.x});;

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

function startGame() {
    let map = kontra.dataAssets['assets/map'];

    let tileEngine = kontra.TileEngine(map);

    tileEngine.sx = 0;
    tileEngine.sy = 0;

    // Player and enemies
    let enemies = createEnemies(tileEngine);
    let player = createPlayer(tileEngine);
    tileEngine.addObject(player);
    enemies.map( enemy => tileEngine.addObject(enemy));

    // Debug stuff
    let gridSprite = createDebugGrid(tileEngine);
    tileEngine.addObject(gridSprite);

    let loop = kontra.GameLoop({
        update: function(dt) {
            player.update(dt);

            enemies.map(enemy => {
                enemy.update(dt);
                testEnemyCollisionWithGroundLayer(enemy, tileEngine);

                let rectPlayer = player.getRect();
                let rectEnemy = enemy.getRect();
                if (rectIntersectsRect(rectPlayer, rectEnemy)) {
                    if (intersectionSide(rectPlayer, rectEnemy) == 'top') {
                        enemy.ttl = 0;
                    }
                    else {
                        // TODO: handle game over
                    }
                    
                }
            });

            if (this.x < tileEngine.sx) {
                gridSprite.x = tileEngine.sx;
            }

        },
        render: function() {
            tileEngine.render();
            player.render();

            enemies = enemies.filter(enemy => enemy.isAlive());
            enemies.map(enemy => enemy.render());

            gridSprite.render();
        }
    });

    loop.start();
}
