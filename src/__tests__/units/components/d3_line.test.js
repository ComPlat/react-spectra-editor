import LineFocus from '../../../components/d3_line/line_focus';
import { LIST_LAYOUT } from '../../../constants/list_layout';

// PLAIN is the generic-curve fallback for an unrecognised JCAMP datatype, which has
// no basis for the NMR/IR-style reversed axis every unlisted layout defaults to.
describe('LineFocus.reverseXAxis', () => {
  const lf = Object.create(LineFocus.prototype);

  it('does not reverse the axis for PLAIN', () => {
    expect(lf.reverseXAxis(LIST_LAYOUT.PLAIN)).toBe(false);
  });

  it('still reverses the axis for NMR layouts', () => {
    expect(lf.reverseXAxis(LIST_LAYOUT.C13)).toBe(true);
  });

  it('still does not reverse the axis for TGA', () => {
    expect(lf.reverseXAxis(LIST_LAYOUT.TGA)).toBe(false);
  });

  // AIF used to be reversed here but not in multi_focus. p/p0 ascends, as in the
  // backend's SORPTION-DESORPTION MEASUREMENT (x_reversed=False).
  it('does not reverse the axis for AIF', () => {
    expect(lf.reverseXAxis(LIST_LAYOUT.AIF)).toBe(false);
  });
});
