import { almostEqual, calcSlope } from '../../../helpers/calc';

describe('Test calculation helpers', () => {
  describe('Test almostEqual function', () => {
    test('Almost equal with equal numbers', () => {
      const a = 0;
      const b = 0;
      const output = almostEqual(a, b);
      expect(output).toEqual(false);
    });
    test('Almost equal with diferrent numbers', () => {
      const a = 0;
      const b = 1;
      const output = almostEqual(a, b);
      expect(output).toEqual(false);
    });
    test('Almost equal with almost equal numbers', () => {
      const a = 1.0000000000000001;
      const b = 1.00000000000000015;
      const output = almostEqual(a, b);
      expect(output).toEqual(true);
    });
  });

  describe('Test calcSlope function', () => {
    test('No slop', () => {
      let a = {x: 0, y: 0};
      let b = {x: 0, y: 0};
      let output = calcSlope(a.x, a.y, b.x, b.y);
      expect(output).toEqual(0);

      a = {x: 1, y: 2};
      b = {x: 1, y: 2};
      output = calcSlope(a.x, a.y, b.x, b.y);
      expect(output).toEqual(0);
    });

    test('Has slop', () => {
      const a = {x: 0, y: -1};
      const b = {x: 1, y: 2};
      const output = calcSlope(a.x, a.y, b.x, b.y);
      expect(output).toEqual(3);
    });
  });
});