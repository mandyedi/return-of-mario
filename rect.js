export class Rect {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    set x(value) {
        this._x = value;
    }

    set y(value) {
        this._y = value;
    }

    set width(value) {
        this._width = value;
    }

    set height(value) {
        this._height = value;
    }
}

export function rectIntersectsRect(rect1, rect2) {
    return  rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
}

export function rectIntersection(rect1, rect2) {
    let left = Math.max(rect1.x, rect2.x);
    let top = Math.max(rect1.y, rect2.y);
    let right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
    let bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
    return new Rect(left, top, right - left, bottom - top);  
}

// Returns the collision side of the obj2
export function intersectionSide(rect1, rect2) {
    let i = rectIntersection(rect1, rect2);
    if (i.width > i.height) {
        // Intersection is bottom or top side
        if (rect1.y < rect2.y) {
            return 'top';
        }
        else {
            return 'bottom';
        }
    }
    else {
        // Intersection is left or right side
        if (rect1.x < rect2.x) {
            return 'left';
        }
        else {
            return 'right';
        }
    }
}