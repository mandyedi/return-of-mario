let { init, TileEngine, dataAssets, imageAssets, GameLoop, Vector } = kontra;

kontra.init();
kontra.initKeys();

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
    'assets/player_big.png'
).then(assets => {
    // TODO: all assets have loaded
    startGame();
}).catch(err => {
    console.log("Error: " + err);
    // TODO: handle error
});

function startGame() {
    let tileEngine = TileEngine(dataAssets['assets/map']);

    let debugText = kontra.Text({
        text: '',
        font: '24px Arial',
        color: 'black',
        x: 300,
        y: 16,
        textAlign: 'center'
    });

    let player = kontra.Sprite({
        x: 140,
        y: 288,
        width:64,
        height: 128,
        
        // Velocity
        dx: 0,
        dy: 0,
        // Acceleration
        ddx: 0,
        ddy: 0,

        image: imageAssets['assets/player_big'],

        // Custom paramteres
        desiredPosition: Vector(0, 0),
        onGround: false,
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
            
            let tilePosPlayer   = Vector(this.x / tileEngine.tilewidth | 0, this.y / tileEngine.tileheight | 0);
            let tilePosRight    = Vector(tilePosPlayer.x + 1, tilePosPlayer.y);
            let tilePosBottom   = Vector(tilePosPlayer.x, tilePosPlayer.y + 2);
            let tilePosDiag     = Vector(tilePosPlayer.x + 1, tilePosPlayer.y + 2);
            let tileTypePlayer  = tileEngine.tileAtLayer('groundLayer', {row: tilePosPlayer.y, col: tilePosPlayer.x});
            let tileTypeRight   = tileEngine.tileAtLayer('groundLayer', {row: tilePosRight.y, col: tilePosRight.x});
            let tileTypeBottom  = tileEngine.tileAtLayer('groundLayer', {row: tilePosBottom.y, col: tilePosBottom.x});
            let tileTypeDiag    = tileEngine.tileAtLayer('groundLayer', {row: tilePosDiag.y, col: tilePosDiag.x});;

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

            if (this.dx > 0) {
                if (tileTypeRight && !tileTypePlayer) {
                    this.x = tilePosPlayer.x * tileEngine.tilewidth;
                    this.dx = 0;
                }
            }
            else if (this.dx < 0) {
                if (tileTypePlayer && !tileTypeRight) {
                    this.x = (tilePosPlayer.x + 1) * tileEngine.tilewidth;
                    this.dx = 0;
                }
            }

            // TODO: clamp dx, dy
            this.advance();

            debugText.text = 'player pos: ' + this.x.toFixed(2) + ' ' + this.y.toFixed(2);
            debugText.text += '\ntileCoord: ' + tilePosPlayer.x + ' ' + tilePosPlayer.y;
            debugText.text += '\ntileTypePlayer: ' + tileTypePlayer;
            debugText.text += '\ntileTypeRight: ' + tileTypeRight;
            debugText.text += '\ntileTypeBottom: ' + tileTypeBottom;           
        }
    });

    let gridSprite = kontra.Sprite({
        x: 0,
        y: 0,
        width: tileEngine.mapwidth,
        height: tileEngine.mapheight,      
      
        render: function() {
          this.context.strokeStyle = 'white';
          this.context.beginPath();
          for (let x = 0; x < this.width; x += 64 ) {
              for (let y = 0; y < this.height; y += 64 ) {
                this.context.moveTo(0, y);
                this.context.lineTo(this.width, y);
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.height);
              }
          }
          this.context.closePath();
          this.context.stroke();
        }
      });

    let loop = GameLoop({
        update: function(dt) {
            player.update(dt);
        },
        render: function() {
            tileEngine.render();
            player.render();

            gridSprite.render();
            debugText.render();
        }
    });

    loop.start();
}