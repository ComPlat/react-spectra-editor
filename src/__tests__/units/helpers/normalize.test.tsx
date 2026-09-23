import { maxY, scaleToReference, toPercent } from '../../../helpers/normalize';

describe('Test normalize helper', () => {
  const data = [{ x: 1, y: 2 }, { x: 2, y: 8 }, { x: 3, y: -1 }];

  it('finds the highest peak', () => {
    expect(maxY(data)).toEqual(8);
    expect(maxY([])).toBeNull();
    expect(maxY(undefined)).toBeNull();
  });

  it('scales a curve so its highest peak matches the reference', () => {
    const scaled = scaleToReference(data, 4);
    expect(scaled.map((d) => d.y)).toEqual([1, 4, -0.5]);
    expect(scaled.map((d) => d.x)).toEqual([1, 2, 3]);
  });

  it('leaves data untouched for non-positive maxima', () => {
    expect(scaleToReference(data, 0)).toBe(data);
    const negative = [{ x: 1, y: -2 }];
    expect(scaleToReference(negative, 4)).toBe(negative);
  });

  it('converts to percent of the reference peak', () => {
    expect(toPercent(4, 8)).toEqual(50);
    expect(toPercent(8, 8)).toEqual(100);
  });
});
