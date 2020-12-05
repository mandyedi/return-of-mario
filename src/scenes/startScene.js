let canvas = kontra.getCanvas();

let startButton = kontra.Button({
  text: {
    color: 'white',
    font: '30px Arial Black',
    text: 'Start Game',
    anchor: { x: 0.5, y: 0.5 }
  },
  anchor: { x: 0.5, y: 0.5 },
  x: canvas.width / 2,
  y: canvas.height / 2,
  onUp() {
    kontra.emit('navigate', 'map');
  },
  render() {
    this.draw();

    if (this.focused || this.hovered) {
      this.textNode.color = 'red';
    }
    else {
      this.textNode.color = 'white';
    }
  }
});

kontra.track(startButton);

let startScene = kontra.Scene({
  id: 'start'
});

startScene.addChild(startButton);

export default startScene;