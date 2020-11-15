export default function createDebugGrid(tileEngine) {
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

      return gridSprite;
}