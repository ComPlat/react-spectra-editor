import { PksEdit } from './converter';
import { Convert2Peak } from './chem';
import { FromManualToOffset } from './shift';
import Format from './format';

const niOffset = (shiftSt) => {
  const { ref, peak } = shiftSt;
  const offset = FromManualToOffset(ref, peak);
  return offset;
};

const msOffset = () => 0;

const extractPeaksEdit = (feature, editPeakSt, thresSt, shiftSt, layoutSt) => {
  const offset = Format.isMsLayout(layoutSt) ? msOffset() : niOffset(shiftSt);
  const peaks = Convert2Peak(feature, thresSt.value, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  return peaksEdit;
};

export { extractPeaksEdit }; // eslint-disable-line
