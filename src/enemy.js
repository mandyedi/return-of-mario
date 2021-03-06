import { Rect, rectIntersection, rectIntersectsRect } from './rect.js';

export default function createEnemies(tileEngine) {
    let enemies = [];

    tileEngine.layerMap['enemy'].objects.map(enemyObject => {
        let enemy = kontra.Sprite({
            x: enemyObject.x,
            y: enemyObject.y,
            width: enemyObject.width,
            height: enemyObject.height,
            
            // Velocity
            dx: 0,
            dy: 0,
            // Acceleration
            ddx: 0,
            ddy: 0,
    
            image: kontra.imageAssets['assets/' + enemyObject.name],
    
            // Custom paramters
            speed: -96,
            active: false,

            getRect() {
                return new Rect(this.x, this.y, this.width, this.height);
            },
    
            update(dt) {
                this.dx = this.speed * dt; // speed
                this.ddy = 32 * dt; // gravity

                // TODO: clamp dx, dy
                this.advance();
            }
        });
        enemies.push(enemy);
    });

    return enemies;
}