import assert from 'assert';
import { Rect, rectIntersectsRect, rectIntersection } from '../rect.js'

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
  });
});
