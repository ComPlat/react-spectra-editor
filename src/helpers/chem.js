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

const convertTopic = (topic, offset) => {
  const sp = [];
  const xs = topic.x;
  const ys = topic.y;
  for (let i = 0; i < ys.length; i += 1) { // no-downsample
    const x = xs[i] - offset;
    const y = ys[i];
    sp.push({ x, y });
  }
  return sp;
};

const Topic2Seed = createSelector(
  getTopic,
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

const extractShift = (s, jcamp) => {
  const shift = {
    selectX: false,
    solventName: false,
    solventValue: false,
  };
  if (!s) return shift;
  return {
    selectX: parseFloat(jcamp.info.$CSSOLVENTX) || false,
    solventName: jcamp.info.$CSSOLVENTNAME || false,
    solventValue: parseFloat(jcamp.info.$CSSOLVENTVALUE) || false,
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
        scanCount: +jcamp.info.$CSSCANCOUNT,
        scanAutoTarget: +jcamp.info.$CSSCANAUTOTARGET,
        scanEditTarget: +jcamp.info.$CSSCANEDITTARGET,
        shift: extractShift(s, jcamp),
        operation: {
          typ: sTyp,
          nucleus: jcamp.xType || '',
        },
      },
      s,
    )
  );
};

const isPeakTable = s => (
  s.dataType && (
    s.dataType.includes('PEAKTABLE')
      || s.dataType.includes('PEAK ASSIGNMENTS')
  )
);

const extractFeature = (jcamp, sTyp, peakUp) => {
  const features = jcamp.spectra.map((s) => {
    const thresRef = calcThresRef(s, peakUp);
    return isPeakTable(s)
      ? buildFeature(jcamp, sTyp, peakUp, s, thresRef)
      : null;
  }).filter(r => r != null);
  // workaround for legacy design
  if (features.length > 0 && features[0].dataType.includes('PEAKTABLE')) {
    features.reverse();
  }

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
  const thresRef = (jcamp.info && jcamp.info.$CSTHRESHOLD * 100) || 5;
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
      keepRecordsRegExp: /(\$CSTHRESHOLD|\$CSSCANAUTOTARGET|\$CSSCANEDITTARGET|\$CSSCANCOUNT|\$CSSOLVENTNAME|\$CSSOLVENTVALUE|\$CSSOLVENTX)/, // eslint-disable-line
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

const Convert2Scan = (feature, scanSt) => {
  const { scanAutoTarget, scanEditTarget } = feature;
  const { target, isAuto } = scanSt;
  const hasEdit = !!scanEditTarget;
  const defaultIdx = (isAuto || !hasEdit) ? scanAutoTarget : scanEditTarget;
  return target || defaultIdx;
};

const Convert2Thres = (feature, thresSt) => {
  const value = thresSt.value || feature.thresRef;
  return value;
};

export {
  ExtractJcamp, Topic2Seed, Feature2Peak,
  ToThresEndPts, ToShiftPeaks,
  Convert2Peak, Convert2Scan, Convert2Thres,
};
