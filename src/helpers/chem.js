import Jcampconverter from 'jcampconverter';
import { createSelector } from 'reselect';

import { FromManualToOffset } from './shift';
import Cfg from './cfg';
import Format from './format';

const getTopic = (_, props) => props.topic;

const getFeature = (_, props) => props.feature;

const getLayout = (state, _) => state.layout; // eslint-disable-line

const getShiftOffset = (state, _) => { // eslint-disable-line
  const { shift } = state;
  const { ref, peak } = shift;
  return FromManualToOffset(ref, peak);
};

const convertTopic = (topic, layout, feature, offset) => {
  const { maxY } = feature;
  const sp = [];
  const xs = topic.x;
  const ys = topic.y;

  const isItgDisable = Cfg.btnCmdIntg(layout);
  if (!isItgDisable) {
    let k = 0;
    for (let i = 0; i < ys.length; i += 1) { // no-downsample
      const x = xs[i] - offset;
      const y = ys[i];
      const cy = y / maxY;
      if (cy > 0.0) { k += cy; }
      sp.push({ x, y, k });
    }
    return sp;
  }

  for (let i = 0; i < ys.length; i += 1) { // no-downsample
    const x = xs[i] - offset;
    const y = ys[i];
    sp.push({ x, y });
  }
  return sp;
};

const Topic2Seed = createSelector(
  getTopic,
  getLayout,
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
    if (s.dataType.includes('RAMAN SPECTRUM')) {
      return 'RAMAN';
    }
    if (s.dataType.includes('MASS SPECTRUM')) {
      return 'MS';
    }
  }
  return false;
};

const extractSpectrum = (jcamp) => {
  const subTyp = jcamp.xType ? ` - ${jcamp.xType}` : '';
  const categorys = jcamp.info.$CSCATEGORY || ['SPECTRUM'];
  const targetIdx = categorys.indexOf('SPECTRUM');
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
  }).filter(r => r != null)[targetIdx];

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
  if (s && s.sampleDescription) {
    const desc = s.sampleDescription;
    const info = desc.split(/;|=/);

    return {
      selectX: parseFloat(info[1]),
      solventName: info[3],
      solventValue: parseFloat(info[5]),
    };
  }
  return {
    selectX: parseFloat(jcamp.info.$CSSOLVENTX) || false,
    solventName: jcamp.info.$CSSOLVENTNAME || false,
    solventValue: parseFloat(jcamp.info.$CSSOLVENTVALUE) || false,
  };
};

const buildPeakFeature = (jcamp, sTyp, peakUp, s, thresRef) => {
  const { xType, info } = jcamp;
  const subTyp = xType ? ` - ${xType}` : '';

  return (
    Object.assign(
      {
        typ: s.dataType + subTyp,
        peakUp,
        thresRef,
        scanCount: +info.$CSSCANCOUNT,
        scanAutoTarget: +info.$CSSCANAUTOTARGET,
        scanEditTarget: +info.$CSSCANEDITTARGET,
        shift: extractShift(s, jcamp),
        operation: {
          typ: sTyp,
          nucleus: xType || '',
        },
        observeFrequency: info['.OBSERVEFREQUENCY'],
        solventName: info['.SOLVENTNAME'],
      },
      s,
    )
  );
};

const buildIntegFeature = (jcamp) => {
  const { $OBSERVEDINTEGRALS, $OBSERVEDMULTIPLETS } = jcamp.info;
  const regx = /[^0-9.,-]/g;
  let stack = [];
  if ($OBSERVEDINTEGRALS) {
    const its = $OBSERVEDINTEGRALS.split('\n').slice(1);
    const itStack = its.map((t) => {
      const ts = t.replace(regx, '').split(',');
      return {
        xL: parseFloat(ts[0]),
        xU: parseFloat(ts[1]),
        area: parseFloat(ts[2]),
      };
    });
    stack = [...stack, ...itStack];
  }
  if ($OBSERVEDMULTIPLETS) {
    const mps = $OBSERVEDMULTIPLETS.split('\n');
    const mpStack = mps.map((m) => {
      const ms = m.replace(regx, '').split(',');
      return {
        xL: parseFloat(ms[1]),
        xU: parseFloat(ms[2]),
        area: parseFloat(ms[4]),
      };
    });
    stack = [...stack, ...mpStack];
  }

  return (
    {
      refArea: 1,
      refFactor: 1,
      shift: 0,
      stack,
    }
  );
};

/*
const range = (head, tail, length) => {
  const actTail = tail || length - 1;
  return (
    Array(actTail - head + 1).fill().map((_, idx) => head + idx)
  );
};
*/

const buildMpyFeature = (jcamp) => {
  const { $OBSERVEDMULTIPLETS, $OBSERVEDMULTIPLETSPEAKS } = jcamp.info;
  const regx = /[^A-Za-z0-9.,-]/g;
  const regxNum = /[^0-9.]/g;
  let stack = [];
  if (!$OBSERVEDMULTIPLETSPEAKS) return { stack: [] };
  const allPeaks = $OBSERVEDMULTIPLETSPEAKS.split('\n').map(
    p => p.replace(regx, '').split(','),
  );

  if ($OBSERVEDMULTIPLETS) {
    const mp = $OBSERVEDMULTIPLETS.split('\n');
    const mpStack = mp.map((m) => {
      const ms = m.replace(regx, '').split(',');
      const idx = ms[0];
      let ys = [];
      const peaks = allPeaks.map((p) => {
        if (p[0] === idx) {
          ys = [...ys, parseFloat(p[2])];
          return { x: parseFloat(p[1]), y: parseFloat(p[2]) };
        }
        return null;
      }).filter(r => r != null);
      let js = m.split(',');
      js = js[js.length - 1].split(' ')
        .map(j => parseFloat(j.replace(regxNum, '')))
        .filter(Boolean);

      return {
        js,
        mpyType: ms[6],
        xExtent: {
          xL: parseFloat(ms[1]),
          xU: parseFloat(ms[2]),
        },
        yExtent: {
          yL: Math.min(...ys),
          yU: Math.max(...ys),
        },
        peaks,
      };
    });
    stack = [...stack, ...mpStack];
  }

  return (
    {
      stack,
      shift: 0,
      smExtext: false,
    }
  );
};

const isPeakTable = s => (
  s.dataType && (
    s.dataType.includes('PEAKTABLE')
      || s.dataType.includes('PEAK ASSIGNMENTS')
  )
);

const extractFeatures = (jcamp, sTyp, peakUp) => {
  const nfs = {};
  const category = jcamp.info.$CSCATEGORY;
  if (category) {
    const idxEditPeak = category.indexOf('EDIT_PEAK');
    if (idxEditPeak >= 0) {
      const sEP = jcamp.spectra[idxEditPeak];
      const thresRef = calcThresRef(sEP, peakUp);
      nfs.editPeak = buildPeakFeature(jcamp, sTyp, peakUp, sEP, thresRef);
    }
    const idxAutoPeak = category.indexOf('AUTO_PEAK');
    if (idxAutoPeak >= 0) {
      const sAP = jcamp.spectra[idxAutoPeak];
      const thresRef = calcThresRef(sAP, peakUp);
      nfs.autoPeak = buildPeakFeature(jcamp, sTyp, peakUp, sAP, thresRef);
    }
    nfs.integration = buildIntegFeature(jcamp);
    nfs.multiplicity = buildMpyFeature(jcamp);
    return nfs;
  }
  // workaround for legacy design
  const features = jcamp.spectra.map((s) => {
    const thresRef = calcThresRef(s, peakUp);
    return isPeakTable(s)
      ? buildPeakFeature(jcamp, sTyp, peakUp, s, thresRef)
      : null;
  }).filter(r => r != null);

  return { editPeak: features[0], autoPeak: features[1] };
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

const extractMsFeatures = (jcamp, sTyp, peakUp) => {
  const thresRef = (jcamp.info && jcamp.info.$CSTHRESHOLD * 100) || 5;
  const base = jcamp.spectra[0];

  const features = jcamp.spectra.map((s) => {
    const cpo = buildPeakFeature(jcamp, sTyp, peakUp, s, +thresRef.toFixed(4));
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
      keepRecordsRegExp: /(\$CSTHRESHOLD|\$CSSCANAUTOTARGET|\$CSSCANEDITTARGET|\$CSSCANCOUNT|\$CSSOLVENTNAME|\$CSSOLVENTVALUE|\$CSSOLVENTX|\$CSCATEGORY|\$CSITAREA|\$CSITFACTOR|\$OBSERVEDINTEGRALS|\$OBSERVEDMULTIPLETS|\$OBSERVEDMULTIPLETSPEAKS|\.SOLVENTNAME|\.OBSERVEFREQUENCY)/, // eslint-disable-line
    },
  );
  const spectrum = extractSpectrum(jcamp);
  const sTyp = spectrum ? spectrum.sTyp : '';

  const peakUp = !Format.isIrLayout(sTyp);
  const features = sTyp === 'MS'
    ? extractMsFeatures(jcamp, sTyp, peakUp)
    : extractFeatures(jcamp, sTyp, peakUp);

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

const GetFeature = entity => (
  entity.spectrum.sTyp === 'MS'
    ? entity.features[0]
    : (entity.features.editPeak || entity.features.autoPeak)
);

export {
  ExtractJcamp, Topic2Seed, Feature2Peak,
  ToThresEndPts, ToShiftPeaks, GetFeature,
  Convert2Peak, Convert2Scan, Convert2Thres,
};
