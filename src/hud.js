let canvas = kontra.getCanvas();

function padZeroes(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }
    return my_string;
}

function createText(props) {
    return kontra.Text({
        font: '18px Arial Black',
        textAlign: 'center',
        color: 'white',
        anchor: { x: 0.5, y: 0.5 },
        ...props
    });
}

let points = createText({
    text: 'MARIO\n000000',
    value: 0,
    reset: function() {
        this.value = 0;
        this.text = 'MARIO\n000000';
    }
});

let coins = createText({
    text: 'Ox00',
    value: 0,
    reset: function() {
        this.value = 0;
        this.text = 'Ox00';
    }
});

let world = createText({
    text: 'WORLD\n0-0',
    reset: function() {
        this.text = 'WORLD\n0-0';
    }
});

let time = createText({
    text: 'TIME\n400',
    value: 400,
    update: function(dt) {
        this.value -= dt || 0;
        this.text = 'TIME\n' + Math.floor(this.value);
    },
    reset: function() {
        this.value = 400;
        this.text = 'TIME\n400';
    }
});

let hud = kontra.Grid({
    flow: 'row',
    colGap: 64,
    anchor: {x: 0.5, y: 0},
    x: canvas.width / 2,
    y: 0,
    children: [
        points,
        coins,
        world,
        time
    ],
    
    reset: function() {
        this.children.map(child => child.reset());
    },
    
    update: function(dt) {
        this.children.map(child => child.update(dt));
    },

    updatePoints: function(value) {
        points.value += value;
        points.text = 'MARIO\n' + padZeroes(points.value, 6);
    },

    updateCoins: function(value) {
        coins.value += value;
        coins.text = 'Ox' + padZeroes(coins.value, 2);
    },

    updateWorld: function(value) {
        world.text = 'WORLD\n' + value;
    }
});

export default hud;