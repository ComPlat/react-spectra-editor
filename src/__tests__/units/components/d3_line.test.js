import LineFocus from '../../../components/d3_line/line_focus';
import { LIST_LAYOUT } from '../../../constants/list_layout';

// PLAIN is the generic-curve fallback for an unrecognized JCAMP datatype (see
// chem-spectra-app#291 and layer_init.js's PLAIN normalization). Before this,
// reverseXAxis() defaulted every layout outside its explicit whitelist to a
// reversed x-axis, so an unmapped-datatype spectrum got the same "reversed
// axis it has no basis for" symptom #291 fixed on the backend for NMR.
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
});
