let canvas = kontra.getCanvas();

let gameOverText = kontra.Text({
    text: 'Game Over',
    font: '30px Arial Black',
    color: 'white',
    x: canvas.width / 2,
    y: canvas.height / 2,
    anchor: {x: 0.5, y: 0.5},
    textAlign: 'center'
});

let overScene = kontra.Scene({
    id: 'over',
    time: 0,
    onShow: function() {
        this.timer = 0;
    },
    update: function(dt) {
        if (this.timer > 3) {
            kontra.emit('navigate', 'start');
        }
        this.timer += dt;
    }
});

overScene.addChild(gameOverText);
  
export default overScene;