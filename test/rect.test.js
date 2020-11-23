import assert from 'assert';
import { Rect, rectIntersectsRect, rectIntersection, intersectionSide } from '../rect.js'

let r1 = new Rect(2, 1, 4, 3);
let r2 = new Rect(7, 3, 5, 8);
let r3 = new Rect(4, 3, 3, 3);

describe('Rect', () => {
  describe('Set x, y, width, height', () => {
    it('should create Rect with parameters 4 5, 10, 20', () => {
      assert.strictEqual(r1.x, 2);
      assert.strictEqual(r1.y, 1);
      assert.strictEqual(r1.width, 4);
      assert.strictEqual(r1.height, 3);
    });

    it('should not intersect', () => {
        let i = rectIntersectsRect(r1, r2);
        assert.strictEqual(i, false);
    });

    it('should intersect', () => {
        let i = rectIntersectsRect(r1, r3);
        assert.strictEqual(i, true);
    });

    it('should get intersection', () => {
        let r = rectIntersection(r1, r3);
        assert.strictEqual(r.x, 4);
        assert.strictEqual(r.y, 3);
        assert.strictEqual(r.width, 2);
        assert.strictEqual(r.height, 1);
    });

    it('should intersect on left', () => {
      let r1 = new Rect(0, 1, 6, 6);
      let r2 = new Rect(5, 5, 10, 10);
      let side = intersectionSide(r1, r2);
      assert.strictEqual(side, 'left');
    });

    it('should intersect on top', () => {
      let r1 = new Rect(3, 1, 7, 7);
      let r2 = new Rect(5, 5, 10, 10);
      let side = intersectionSide(r1, r2);
      assert.strictEqual(side, 'top');
    });

    it('should intersect on right', () => {
      let r1 = new Rect(14, 3, 6, 13);
      let r2 = new Rect(5, 5, 10, 10);
      let side = intersectionSide(r1, r2);
      assert.strictEqual(side, 'right');
    });

    it('should intersect on bottom', () => {
      let r1 = new Rect(4, 14, 7, 7);
      let r2 = new Rect(5, 5, 10, 10);
      let side = intersectionSide(r1, r2);
      assert.strictEqual(side, 'bottom');
    });
  });
});
