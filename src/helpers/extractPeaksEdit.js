/* eslint-disable max-len */
import { Convert2Peak } from './chem';
import { PksEdit } from './converter';
import { shiftOffsetAtIndex } from './shift';
import Format from './format';
import { calcArea } from './integration';
import {
  formatLcmsPeaksForBackend,
  formatLcmsIntegralsForBackend,
  getLcmsMzPageData,
} from '../features/lc-ms/submit';

const extractAutoPeaks = (feature, thresSt, shiftSt, layoutSt, atIndex = 0) => {
  const offset = (Format.isMsLayout(layoutSt) || Format.isLCMsLayout(layoutSt)) ? 0 : shiftOffsetAtIndex(shiftSt, atIndex);
  const peaks = Convert2Peak(feature, thresSt.value, offset);
  return peaks;
};

const extractPeaksEdit = (feature, editPeakSt, thresSt, shiftSt, layoutSt, atIndex = 0) => {
  if (Format.isLCMsLayout(layoutSt)) return [];
  const peaks = extractAutoPeaks(feature, thresSt, shiftSt, layoutSt, atIndex);
  return PksEdit(peaks, editPeakSt);
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
