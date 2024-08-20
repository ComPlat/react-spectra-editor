/* eslint-disable max-len */
import { PksEdit } from './converter';
import { Convert2Peak } from './chem';
import { FromManualToOffset } from './shift';
import Format from './format';
import { calcArea } from './integration';

const niOffset = (shiftSt, atIndex = 0) => {
  const { shifts } = shiftSt;
  const selectedShift = shifts[atIndex];
  if (!selectedShift) {
    return 0;
  }
  const { ref, peak } = selectedShift;
  const offset = FromManualToOffset(ref, peak);
  return offset;
};

const msOffset = () => 0;

const extractPeaksEdit = (feature, editPeakSt, thresSt, shiftSt, layoutSt, atIndex = 0) => {
  const offset = (Format.isMsLayout(layoutSt) || Format.isLCMsLayout(layoutSt)) ? msOffset() : niOffset(shiftSt, atIndex);
  const peaks = Convert2Peak(feature, thresSt.value, offset);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  return peaksEdit;
};

const extractAutoPeaks = (feature, thresSt, shiftSt, layoutSt, atIndex = 0) => {
  const offset = (Format.isMsLayout(layoutSt) || Format.isLCMsLayout(layoutSt)) ? msOffset() : niOffset(shiftSt, atIndex);
  const peaks = Convert2Peak(feature, thresSt.value, offset);
  return peaks;
};

const getAUCValue = (integrationSt, layoutSt) => {
  const { refArea, refFactor, stack } = integrationSt;
  if (Array.isArray(stack) && stack.length > 0) {
    const data = stack.at(-1);
    const ignoreRef = Format.isHplcUvVisLayout(layoutSt);
    return calcArea(data, refArea, refFactor, ignoreRef);
  }
  return 0;
};

const extractAreaUnderCurve = (allIntegrationSt, presentIntegrationSt, layoutSt) => {
  if ((Format.isHplcUvVisLayout(layoutSt))
  && Array.isArray(allIntegrationSt) && presentIntegrationSt) {
    const results = [];
    allIntegrationSt.forEach((inte) => {
      const { integrations } = inte;
      const subResults = [];
      integrations.forEach((subInte) => {
        const aucVal = getAUCValue(subInte, layoutSt);
        subResults.push(aucVal);
      });
      results.push(subResults);
    });
    return results;
  }
  return null;
};

export { extractPeaksEdit, extractAreaUnderCurve, extractAutoPeaks }; // eslint-disable-line
