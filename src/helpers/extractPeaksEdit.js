/* eslint-disable max-len */
import { Convert2Peak } from './chem';
import { FromManualToOffset } from './shift';
import Format from './format';
import { calcArea } from './integration';
import {
  formatLcmsPeaksForBackend,
  formatLcmsIntegralsForBackend,
  getLcmsMzPageData,
} from '../features/lc-ms/submit';

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

function extractPeaksEdit(hplcMsSt) {
  if (!hplcMsSt || !hplcMsSt.uvvis || !hplcMsSt.uvvis.spectraList) return [];
  return hplcMsSt.uvvis.spectraList.flatMap((spectrum) => spectrum.peaks || []);
}

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

export { extractPeaksEdit, extractAreaUnderCurve, extractAutoPeaks, formatLcmsPeaksForBackend, formatLcmsIntegralsForBackend, getLcmsMzPageData }; // eslint-disable-line
