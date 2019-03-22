import Jcampconverter from 'jcampconverter';
import { createSelector } from 'reselect';

import { FromManualToOffset } from './shift';

const getTopic = (_, props) => props.topic;

const getFeature = (_, props) => props.feature;

const getShiftOffset = (state, _) => { // eslint-disable-line
  const { shift } = state;
  const { ref, peak } = shift;
  return FromManualToOffset(ref, peak);
};

const downSample = (feature) => {
  const { peakUp, maxY } = feature;
  if (!maxY) return { dsRef: false, peakUp };
  const factor = peakUp ? 0.02 : 0.9;
  const dsRef = factor * maxY;
  return { dsRef, peakUp };
};

const dsWithoutRef = (topic, offset) => {
  const sp = [];
  const xs = topic.x;
  const ys = topic.y;
  if (xs.length > 8000) {
    for (let i = 0; i < ys.length; i += 1) { // downsample
      if (i % 2 === 0) {
        const x = xs[i] - offset;
        const y = ys[i];
        sp.push({ x, y });
      }
    }
  } else {
    for (let i = 0; i < ys.length; i += 1) { // no-downsample
      const x = xs[i] - offset;
      const y = ys[i];
      sp.push({ x, y });
    }
  }
  return sp;
};

const dsWithRef = (topic, dsRef, peakUp, offset) => {
  const sp = [];
  const xs = topic.x;
  const ys = topic.y;
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

const convertTopic = (topic, feature, offset) => {
  let ds = { dsRef: false, peakUp: false };
  if (feature.thresRef) {
    ds = downSample(feature);
  }
  const sp = ds.dsRef
    ? dsWithRef(topic, ds.dsRef, ds.peakUp, offset)
    : dsWithoutRef(topic, offset);
  return sp;
};

const Topic2Seed = createSelector(
  getTopic,
  getFeature,
  getShiftOffset,
  convertTopic,
);

const getThreshold = state => (
  state.threshold ? state.threshold.value * 1.0 : false
);

const Convert2Peak = (feature, threshold, offset) => {
  const peak = [];
  if (!feature || !feature.data) return peak;
  const data = feature.data[0];
  const { maxY, peakUp, thresRef } = feature;
  const thresVal = threshold || thresRef;
  const yThres = thresVal * maxY / 100.0;
  const corrOffset = offset || 0.0;
  for (let i = 0; i < data.y.length; i += 1) {
    const y = data.y[i];
    const overThres = (peakUp && y >= yThres) || (!peakUp && y <= yThres);
    if (overThres) {
      const x = data.x[i] - corrOffset;
      peak.push({ x, y });
    }
  }
  return peak;
};

const Feature2Peak = createSelector(
  getFeature,
  getThreshold,
  getShiftOffset,
  Convert2Peak,
);

const convertThresEndPts = (feature, threshold) => {
  if (!feature.thresRef) return [{ x: false, y: false }, { x: false, y: false }];
  const {
    maxY, maxX, minX, thresRef,
  } = feature;

  const thresVal = threshold || thresRef;
  if (!thresVal || !feature.data) return [];
  const yThres = thresVal * maxY / 100.0;
  const endPts = [{ x: minX - 200, y: yThres }, { x: maxX + 200, y: yThres }];
  return endPts;
};

const ToThresEndPts = createSelector(
  getFeature,
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
const getSTyp = (s) => {
  if (s.dataType) {
    if (s.dataType.includes('NMR SPECTRUM')) {
      return 'NMR';
    }
    if (s.dataType.includes('INFRARED SPECTRUM')) {
      return 'INFRARED';
    }
    if (s.dataType.includes('MASS SPECTRUM')) {
      return 'MS';
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

  return spectrum || jcamp.spectra[0];
};

const calcThresRef = (s, peakUp) => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref = peakUp ? Math.min(...ys) : Math.max(...ys);
  return peakUp
    ? Math.floor(ref * 100 * 100 / s.maxY) / 100
    : Math.ceil(ref * 100 * 100 / s.maxY) / 100;
};

const extractShift = (s) => {
  const shift = {
    selectX: false,
    solventName: false,
    solventValue: false,
  };
  if (!s || !s.sampleDescription) return shift;

  const desc = s.sampleDescription;
  const info = desc.split(/;|=/);

  return {
    selectX: parseFloat(info[1]),
    solventName: info[3],
    solventValue: parseFloat(info[5]),
  };
};

const buildFeature = (jcamp, sTyp, peakUp, s, thresRef) => {
  const subTyp = jcamp.xType ? ` - ${jcamp.xType}` : '';

  return (
    Object.assign(
      {
        typ: s.dataType + subTyp,
        peakUp,
        thresRef,
        scanCount: +jcamp.info.$SCANCOUNT,
        scanAutoTarget: +jcamp.info.$SCANAUTOTARGET,
        scanEditTarget: +jcamp.info.$SCANEDITTARGET,
        shift: extractShift(s),
        operation: {
          typ: sTyp,
          nucleus: jcamp.xType || '',
        },
      },
      s,
    )
  );
};

const extractFeature = (jcamp, sTyp, peakUp) => {
  const features = jcamp.spectra.map((s) => {
    const thresRef = calcThresRef(s, peakUp);
    return s.dataType && s.dataType.includes('PEAK ASSIGNMENTS')
      ? buildFeature(jcamp, sTyp, peakUp, s, thresRef)
      : null;
  }).filter(r => r != null);

  return features;
};

const getBoundary = (s) => {
  const { x, y } = s.data[0];
  const maxX = Math.max(...x);
  const minX = Math.min(...x);
  const maxY = Math.max(...y);
  const minY = Math.min(...y);
  return {
    maxX, minX, maxY, minY,
  };
};

const extractMsFeature = (jcamp, sTyp, peakUp) => {
  const thresRef = (jcamp.info && jcamp.info.$THRESHOLD * 100) || 5;
  const base = jcamp.spectra[0];

  const features = jcamp.spectra.map((s) => {
    const cpo = buildFeature(jcamp, sTyp, peakUp, s, +thresRef.toFixed(4));
    const bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter(r => r != null);

  return features;
};

const ExtractJcamp = (source) => {
  const jcamp = Jcampconverter.convert(
    source,
    {
      xy: true,
      keepRecordsRegExp: /(\$THRESHOLD|\$SCANAUTOTARGET|\$SCANEDITTARGET|\$SCANCOUNT)/,
    },
  );
  const spectrum = extractSpectrum(jcamp);
  const sTyp = spectrum ? spectrum.sTyp : '';

  const peakUp = sTyp !== 'INFRARED';
  let features = sTyp === 'MS'
    ? extractMsFeature(jcamp, sTyp, peakUp)
    : extractFeature(jcamp, sTyp, peakUp);
  if (features.length === 0) {
    features = [{
      thresRef: false,
      operation: {
        typ: sTyp,
        nucleus: jcamp.xType || '',
      },
    }];
  }

  return { spectrum, features };
};

export {
  ExtractJcamp, Topic2Seed, Feature2Peak,
  ToThresEndPts, ToShiftPeaks,
  Convert2Peak,
};
