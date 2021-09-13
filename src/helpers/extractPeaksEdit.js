import { PksEdit } from './converter';
import { Convert2Peak } from './chem';
import { FromManualToOffset } from './shift';
import Format from './format';
import { calcArea } from './integration';

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

const getAUCValue = (integrationSt) => {
  const { refArea, refFactor, stack} = integrationSt
  if (Array.isArray(stack) && stack.length > 0) {
    const data = stack.at(-1)
    return calcArea(data, refArea, refFactor)
  }
  return 0;
}

const extractAreaUnderCurve = (allIntegrationSt, presentIntegrationSt, layoutSt) => {
  if (Format.isUvVisLayout(layoutSt) && Array.isArray(allIntegrationSt) && presentIntegrationSt) {
    if (!presentIntegrationSt.refArea) {
      return null;
    }
    let results = [];
    allIntegrationSt.forEach(inte => {
      const aucVal = getAUCValue(inte)
      results.push(aucVal);
    });
    return results;
  }
  return null;
}

export { extractPeaksEdit, extractAreaUnderCurve }; // eslint-disable-line
