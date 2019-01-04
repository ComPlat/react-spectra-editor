import Jcampconverter from 'jcampconverter';
import { createSelector } from 'reselect';

import { FromManualToOffset } from './shift';

const getSpectrum = (_, props) => props.input;

const getPeakObj = (_, props) => props.peakObj;

const getShiftOffset = (state, _) => { // eslint-disable-line
  const { shift } = state;
  const { ref, peak } = shift;
  return FromManualToOffset(ref, peak);
};

const downSample = (spectrum, peakObj) => {
  const { peakUp, maxY } = peakObj;
  if (!maxY) return { dsRef: false, peakUp };
  const factor = peakUp ? 0.02 : 0.9;
  const dsRef = factor * maxY;
  return { dsRef, peakUp };
};

const dsWithoutRef = (spectrum, offset) => {
  const sp = [];
  const xs = spectrum.x;
  const ys = spectrum.y;
  for (let i = 0; i < ys.length; i += 1) { // downsample
    if (i % 2 === 0) {
      const x = xs[i] - offset;
      const y = ys[i];
      sp.push({ x, y });
    }
  }
  return sp;
};

const dsWithRef = (spectrum, dsRef, peakUp, offset) => {
  const sp = [];
  const xs = spectrum.x;
  const ys = spectrum.y;
  for (let i = 0; i < ys.length; i += 1) { // downsample
    const y = ys[i];
    const isDownSample = (peakUp && y < dsRef) || (!peakUp && y > dsRef);
    if (isDownSample) {
      if (i % 3 === 0) {
        const x = xs[i] - offset;
        sp.push({ x, y });
      }
    } else {
      const x = xs[i] - offset;
      sp.push({ x, y });
    }
  }
  return sp;
};

const convertSpectrum = (spectrum, peakObj, offset) => {
  let ds = { dsRef: false, peakUp: false };
  if (peakObj.thresRef) {
    ds = downSample(spectrum, peakObj);
  }
  const sp = ds.dsRef
    ? dsWithRef(spectrum, ds.dsRef, ds.peakUp, offset)
    : dsWithoutRef(spectrum, offset);
  return sp;
};

const Spectrum2Seed = createSelector(
  getSpectrum,
  getPeakObj,
  getShiftOffset,
  convertSpectrum,
);

const getThreshold = state => (
  state.threshold ? state.threshold / 100.0 : false
);

const Convert2Peak = (peakObj, threshold, offset) => {
  const peak = [];
  if (!peakObj || !peakObj.data) return peak;
  const data = peakObj.data[0];
  const { maxY, peakUp, thresRef } = peakObj;
  const yThres = threshold ? (threshold * maxY) : (thresRef * maxY / 100.0);
  for (let i = 0; i < data.y.length; i += 1) {
    const y = data.y[i];
    const overThres = (peakUp && y >= yThres) || (!peakUp && y <= yThres);
    if (overThres) {
      const x = data.x[i] - offset;
      peak.push({ x, y });
    }
  }
  return peak;
};

const Spectrum2Peak = createSelector(
  getPeakObj,
  getThreshold,
  getShiftOffset,
  Convert2Peak,
);

const convertThresEndPts = (peakObj, threshold) => {
  if (!peakObj.thresRef) return [{ x: false, y: false }, { x: false, y: false }];
  const {
    maxY, maxX, minX, thresRef,
  } = peakObj;
  const thresVal = threshold || thresRef;
  if (!thresVal || !peakObj.data) return [];
  const yThres = thresVal * maxY;
  const endPts = [{ x: minX, y: yThres }, { x: maxX, y: yThres }];
  return endPts;
};

const ToThresEndPts = createSelector(
  getPeakObj,
  getThreshold,
  convertThresEndPts,
);

const getShiftPeak = state => (
  state.shift.peak
);

const convertSfPeaks = (peak, offset) => {
  if (!peak || !peak.x) return [];
  return [{ x: peak.x - offset, y: peak.y }];
};

const ToShiftPeaks = createSelector(
  getShiftPeak,
  getShiftOffset,
  convertSfPeaks,
);

// - - - - - - - - - - - - - - - - - - - - - -
// ExtractJcamp
// - - - - - - - - - - - - - - - - - - - - - -

const extractPeakUp = (jcamp) => {
  let peakUp = true;
  jcamp.spectra.forEach((s) => {
    if (s.dataType && s.dataType.includes('INFRARED SPECTRUM')) {
      peakUp = false;
    }
  });
  return peakUp;
};

const getSTyp = (s) => {
  if (s.dataType) {
    if (s.dataType.includes('NMR SPECTRUM')) {
      return 'NMR';
    }
    if (s.dataType.includes('INFRARED SPECTRUM')) {
      return 'INFRARED';
    }
  }
  return false;
};

const extractSpectrum = (jcamp) => {
  const subTyp = jcamp.xType ? ` - ${jcamp.xType}` : '';
  const spectrum = jcamp.spectra.map((s) => {
    const sTyp = getSTyp(s);
    if (!sTyp) return null;
    const target = Object.assign(
      {
        typ: s.dataType + subTyp,
        sTyp,
      },
      s,
    );
    return target;
  }).filter(r => r != null)[0];
  return spectrum;
};

const calcThresRef = (s, peakUp) => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref = peakUp ? Math.min(...ys) : Math.max(...ys);
  return peakUp
    ? Math.floor(ref * 100 * 100 / s.maxY) / 100
    : Math.ceil(ref * 100 * 100 / s.maxY) / 100;
};

const extractPeakObj = (jcamp, peakUp, sTyp) => {
  const subTyp = jcamp.xType ? ` - ${jcamp.xType}` : '';
  const peakObjs = jcamp.spectra.map((s) => {
    const thresRef = calcThresRef(s, peakUp);
    return s.dataType && s.dataType.includes('PEAK ASSIGNMENTS')
      ? Object.assign(
        {
          typ: s.dataType + subTyp,
          peakUp,
          thresRef,
          shift: {
            source: false,
            solvent: false,
          },
          operation: {
            typ: sTyp,
            nucleus: jcamp.xType || '',
          },
        },
        s,
      )
      : null;
  }).filter(r => r != null);

  return peakObjs;
};

const ExtractJcamp = (input) => {
  const jcamp = Jcampconverter.convert(input, { xy: true });
  const peakUp = extractPeakUp(jcamp);

  const spectrum = extractSpectrum(jcamp);
  const sTyp = spectrum ? spectrum.sTyp : '';
  let peakObjs = extractPeakObj(jcamp, peakUp, sTyp);
  if (peakObjs.length === 0) {
    peakObjs = [{
      thresRef: false,
      operation: {
        typ: sTyp,
        nucleus: jcamp.xType || '',
      },
    }];
  }

  return { spectrum, peakObjs };
};

export {
  ExtractJcamp, Spectrum2Seed, Spectrum2Peak,
  ToThresEndPts, ToShiftPeaks,
  Convert2Peak,
};
