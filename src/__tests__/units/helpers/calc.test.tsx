import { almostEqual, calcSlope } from '../../../helpers/calc';

describe('Test calculation helpers', () => {
  describe('Test almostEqual function', () => {
    it('Almost equal with equal numbers', () => {
      const a = 0;
      const b = 0;
      const output = almostEqual(a, b);
      expect(output).toEqual(false);
    });

    it('Almost equal with diferrent numbers', () => {
      const a = 0;
      const b = 1;
      const output = almostEqual(a, b);
      expect(output).toEqual(false);
    });

    it('Almost equal with almost equal numbers', () => {
      const a = 1.0000000000000001;
      const b = 1.00000000000000015;
      const output = almostEqual(a, b);
      expect(output).toEqual(true);
    });
  });

  describe('Test calcSlope function', () => {
    it('No slop as same points', () => {
      const a = {x: 0, y: 0};
      const b = {x: 0, y: 0};
      const output = calcSlope(a.x, a.y, b.x, b.y);
      expect(output).toEqual(0);
    });

    it('Has slop', () => {
      const a = {x: 0, y: -1};
      const b = {x: 1, y: 2};
      const output = calcSlope(a.x, a.y, b.x, b.y);
      expect(output).toEqual(3);
    });
  });
});
