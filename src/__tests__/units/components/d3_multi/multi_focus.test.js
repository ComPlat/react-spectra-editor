import MultiFocus from '../../../../components/d3_multi/multi_focus';
import { LIST_LAYOUT } from '../../../../constants/list_layout';

// Review finding B5 (#232): the CV current-density factor on the chart
// (computeYTransformFactor) must convert the electrode area to cm² exactly
// once. Physically 100 mm² == 1 cm², so the factor for the two must match —
// double-dividing by 100 for mm² made it 100x too small.
// (computeYTransformFactor is pure — it ignores `this` — so it is called via
//  the prototype.)
describe('MultiFocus.computeYTransformFactor — CV current density (B5)', () => {
  const compute = (cvSt) => MultiFocus.prototype.computeYTransformFactor.call(
    {}, LIST_LAYOUT.CYCLIC_VOLTAMMETRY, cvSt, { yUnit: 'A' },
  );

  it('treats 100 mm² the same as 1 cm²', () => {
    const fMm2 = compute({ useCurrentDensity: true, areaValue: 100, areaUnit: 'mm²' });
    const fCm2 = compute({ useCurrentDensity: true, areaValue: 1, areaUnit: 'cm²' });
    expect(fMm2).toBeCloseTo(fCm2);
    expect(fMm2).toBeCloseTo(1.0); // double /100 for mm² gives 0.01
  });

  it('gives A/cm² for a mm² area (factor = 100 / area_mm²)', () => {
    // 50 mm² == 0.5 cm² → factor 1 / 0.5 = 2
    expect(compute({ useCurrentDensity: true, areaValue: 50, areaUnit: 'mm²' })).toBeCloseTo(2.0);
  });

  it('returns 1.0 when current density is off', () => {
    expect(compute({ useCurrentDensity: false })).toBeCloseTo(1.0);
  });
});

// Review finding S1 (PR #336): reverseXAxis() carried its own copy of the
// non-reversed-layout whitelist, missing PLAIN (and EMISSIONS/DLS_ACF/
// DLS_INTENSITY) even after d3_line/line_focus.js's copy was fixed. A
// multi-selection of an unrecognized-datatype entity routes through this
// component, so it kept the reversed axis the PLAIN fix was meant to remove.
// Now delegates to the single shared Format.isNonReversedXLayout.
describe('MultiFocus.reverseXAxis (S1)', () => {
  const mf = Object.create(MultiFocus.prototype);

  it('does not reverse the axis for PLAIN', () => {
    expect(mf.reverseXAxis(LIST_LAYOUT.PLAIN)).toBe(false);
  });

  it('still reverses the axis for NMR layouts', () => {
    expect(mf.reverseXAxis(LIST_LAYOUT.C13)).toBe(true);
  });

  it('still does not reverse the axis for AIF', () => {
    expect(mf.reverseXAxis(LIST_LAYOUT.AIF)).toBe(false);
  });
});
