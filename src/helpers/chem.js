import Jcampconverter from 'jcampconverter';
import { createSelector } from 'reselect';

const getSpectrum = (_, props) => props.input;

const getPeakObj = (_, props) => props.peakObj;

const downSample = (spectrum, peakObj) => {
  const { peakUp, maxY } = peakObj;
  if (!maxY) return { dsRef: false, peakUp };
  const factor = peakUp ? 0.02 : 0.9;
  const dsRef = factor * maxY;
  return { dsRef, peakUp };
};

const dsWithoutRef = (spectrum) => {
  const sp = [];
  const xs = spectrum.x;
  const ys = spectrum.y;
  for (let i = 0; i < ys.length; i += 1) { // downsample
    if (i % 2 === 0) {
      const x = xs[i];
      const y = ys[i];
      sp.push({ x, y });
    }
  }
  return sp;
};

const dsWithRef = (spectrum, dsRef, peakUp) => {
  const sp = [];
  const xs = spectrum.x;
  const ys = spectrum.y;
  for (let i = 0; i < ys.length; i += 1) { // downsample
    const y = ys[i];
    const isDownSample = (peakUp && y < dsRef) || (!peakUp && y > dsRef);
    if (isDownSample) {
      if (i % 3 === 0) {
        const x = xs[i];
        sp.push({ x, y });
      }
    } else {
      const x = xs[i];
      sp.push({ x, y });
    }
  }
  return sp;
};

const convertSpectrum = (spectrum, peakObj) => {
  const { dsRef, peakUp } = downSample(spectrum, peakObj);
  const sp = dsRef
    ? dsWithRef(spectrum, dsRef, peakUp)
    : dsWithoutRef(spectrum);
  return sp;
};

const Spectrum2Seed = createSelector(
  getSpectrum,
  getPeakObj,
  convertSpectrum,
);

const getThreshold = state => (
  state.threshold ? state.threshold / 100.0 : false
);

const convertPeak = (peakObj, threshold) => {
  const peak = [];
  if (!peakObj || !peakObj.data) return peak;
  const data = peakObj.data[0];
  const { maxY, peakUp } = peakObj;
  const yThres = threshold * maxY;
  for (let i = 0; i < data.y.length; i += 1) {
    const y = data.y[i];
    const overThres = (peakUp && y >= yThres) || (!peakUp && y <= yThres);
    if (overThres) {
      const x = data.x[i];
      peak.push({ x, y });
    }
  }
  return peak;
};

const Spectrum2Peak = createSelector(
  getPeakObj,
  getThreshold,
  convertPeak,
);

const convertThresEndPts = (peakObj, threshold) => {
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

const isValid = (s) => {
  const valid = s.dataType
    && (
      s.dataType.includes('NMR SPECTRUM')
      || s.dataType.includes('INFRARED SPECTRUM')
    );
  return valid;
};

const extractSpectrum = (jcamp, subTyp) => {
  const spectrum = jcamp.spectra.map((s) => {
    const valid = isValid(s);
    if (!valid) return null;
    const target = Object.assign(
      {
        typ: s.dataType + subTyp,
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
  return Math.round(ref * 100 * 100 / s.maxY) / 100;
};

const extractPeakObj = (jcamp, subTyp, peakUp) => {
  const peakObjs = jcamp.spectra.map((s) => {
    const thresRef = calcThresRef(s, peakUp);
    return s.dataType && s.dataType.includes('PEAK ASSIGNMENTS')
      ? Object.assign(
        {
          typ: s.dataType + subTyp,
          peakUp,
          thresRef,
        },
        s,
      )
      : null;
  }).filter(r => r != null);

  return peakObjs;
};

const ExtractJcamp = (input) => {
  const jcamp = Jcampconverter.convert(input, { xy: true });
  const subTyp = jcamp.xType ? ` - ${jcamp.xType}` : '';
  const peakUp = extractPeakUp(jcamp);

  const spectrum = extractSpectrum(jcamp, subTyp);
  const peakObjs = extractPeakObj(jcamp, subTyp, peakUp);

  return { spectrum, peakObjs };
};

export {
  ExtractJcamp, Spectrum2Seed, Spectrum2Peak, ToThresEndPts,
};
