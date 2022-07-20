import Jcampconverter from 'jcampconverter';
import { createSelector } from 'reselect';

import { FromManualToOffset } from './shift';
import Cfg from './cfg';
import Format from './format';
import { LIST_LAYOUT } from '../constants/list_layout';
import { getArea } from './integration';

const getTopic = (_, props) => props.topic;

const getFeature = (_, props) => props.feature;

const getLayout = (state, _) => state.layout; // eslint-disable-line

const getShiftOffset = (state, _) => { // eslint-disable-line
  const { shift } = state;
  const { ref, peak } = shift;
  return FromManualToOffset(ref, peak);
};

const calcXYK = (xs, ys, maxY, offset) => {
  const sp = [];
  let k = 0;
  for (let i = 0; i < ys.length; i += 1) { // no-downsample
    const x = xs[i] - offset;
    const y = ys[i];
    const cy = y / maxY;
    if (cy > 0.0) { k += cy; }
    sp.push({ x, y, k });
  }
  return sp;
};

const calcXY = (xs, ys, maxY, offset) => {
  const sp = [];
  for (let i = 0; i < ys.length; i += 1) { // no-downsample
    const x = xs[i] - offset;
    const y = ys[i];
    sp.push({ x, y });
  }
  return sp;
};

const convertTopic = (topic, layout, feature, offset) => {
  const { maxY } = feature;
  const xs = topic.x;
  const ys = topic.y;

  const isItgDisable = Cfg.btnCmdIntg(layout);
  if (!isItgDisable) return calcXYK(xs, ys, maxY, offset);
  return calcXY(xs, ys, maxY, offset);
};

const Topic2Seed = createSelector(
  getTopic,
  getLayout,
  getFeature,
  getShiftOffset,
  convertTopic,
);

const getOthers = (_, props) => props.comparisons;

const calcRescaleXY = (xs, ys, minY, maxY, show) => {
  const sp = [];
  if (xs.length < 1) return sp;
  const [lowerY, upperY] = [Math.min(...ys), Math.max(...ys)];
  const faktor = (maxY - minY) / (upperY - lowerY);
  for (let i = 0; i < ys.length; i += 2) { // downsample
    const x = xs[i];
    const y = (ys[i] - lowerY) * faktor + minY;
    sp.push({ x, y });
  }
  return { data: sp, show };
};

const convertComparisons = (layout, comparisons, feature) => {
  const { minY, maxY } = feature;
  if (!comparisons || !(Format.isIrLayout(layout) || Format.isHplcUvVisLayout(layout) || Format.isXRDLayout(layout))) return [];
  return comparisons.map((c) => {
    const { spectra, show } = c;
    const topic = spectra[0].data[0];
    const xs = topic.x;
    const ys = topic.y;
    return calcRescaleXY(xs, ys, minY, maxY, show);
  });
};

const GetComparisons = createSelector(
  getLayout,
  getOthers,
  getFeature,
  convertComparisons,
);

const convertFrequency = (layout, feature) => {
  if (['1H', '13C', '19F', '31P', '15N', '29Si'].indexOf(layout) < 0) return false;
  const { observeFrequency } = feature;
  const freq = Array.isArray(observeFrequency) ? observeFrequency[0] : observeFrequency;
  return parseFloat(freq) || false;
};

const ToFrequency = createSelector(
  getLayout,
  getFeature,
  convertFrequency,
);

const getThreshold = state => (
  state.threshold ? state.threshold.value * 1.0 : false
);

const Convert2Peak = (feature, threshold, offset, upThreshold=false, lowThreshold=false) => {
  const peak = [];
  if (!feature || !feature.data) return peak;
  const data = feature.data[0];
  const { maxY, peakUp, thresRef, minY, upperThres, lowerThres } = feature;

  if (upperThres || lowerThres) {
    let upperThresVal = upThreshold || upperThres;
    if (!upperThresVal) {
      upperThresVal = 1.0;
    }

    let lowerThresVal = lowThreshold || lowerThres;
    if (!lowerThresVal) {
      lowerThresVal = 1.0
    }

    const yUpperThres = parseFloat(upperThresVal) / 100.0 * maxY;
    const yLowerThres = parseFloat(lowerThresVal) / 100.0 * minY;

    const corrOffset = offset || 0.0;
    for (let i = 0; i < data.y.length; i += 1) {
      const y = data.y[i];
      const overUpperThres = y >= yUpperThres;
      const belowThres = y <= yLowerThres;
      if (overUpperThres || belowThres) {
        const x = data.x[i] - corrOffset;
        peak.push({ x, y });
      }
    }
    return peak;
  }
  else {
    const thresVal = threshold || thresRef;
    const yThres = thresVal * maxY / 100.0;
    const corrOffset = offset || 0.0;
    for (let i = 0; i < data.y.length; i += 1) {
      const y = data.y[i];
      const overThres = (peakUp && Math.abs(y) >= yThres) || (!peakUp && Math.abs(y) <= yThres);
      if (overThres) {
        const x = data.x[i] - corrOffset;
        peak.push({ x, y });
      }
    }
    return peak;
  }
};

const Feature2Peak = createSelector(
  getFeature,
  getThreshold,
  getShiftOffset,
  Convert2Peak,
);

const Convert2MaxMinPeak = (layout, feature, offset) => {
  const peaks = {max: [], min: [], pecker: []};
  if (!Format.isCyclicVoltaLayout(layout) || !feature || !feature.data) return null;
  const data = feature.data[0];
  const { maxY, minY, upperThres, lowerThres, volammetryData } = feature;

  if (volammetryData && volammetryData.length > 0) {
    const maxArr = volammetryData.map((peakData) => {
      if (peakData.max.x === '') return null
      return {x: Number(peakData.max.x), y: Number(peakData.max.y)};
    });
    const minArr = volammetryData.map((peakData) => {
      if (peakData.min.x === '') return null
      return {x: Number(peakData.min.x), y: Number(peakData.min.y)};
    });
    const peckerArr = volammetryData.map((peakData) => {
      if (peakData.pecker.x === '') return null
      return {x: Number(peakData.pecker.x), y: Number(peakData.pecker.y)};
    });
    
    peaks.max = maxArr;
    peaks.min = minArr;
    peaks.pecker = peckerArr;
    return peaks;
  }

  let upperThresVal = upperThres;
  if (!upperThresVal) {
    upperThresVal = 1.0;
  }

  let lowerThresVal = lowerThres;
  if (!lowerThresVal) {
    lowerThresVal = 1.0
  }

  const yUpperThres = parseFloat(upperThresVal) / 100.0 * maxY;
  const yLowerThres = parseFloat(lowerThresVal) / 100.0 * minY;

  const corrOffset = offset || 0.0;
  for (let i = 0; i < data.y.length; i += 1) {
    const y = data.y[i];
    const overUpperThres = y >= yUpperThres;
    const belowThres = y <= yLowerThres;
    const x = data.x[i] - corrOffset;
    if (overUpperThres) {
      peaks.max.push({ x, y });
    }
    else if (belowThres) {
      peaks.min.push({ x, y });
    }
  }
  return peaks;
};

const Feature2MaxMinPeak = createSelector(
  getLayout,
  getFeature,
  getShiftOffset,
  Convert2MaxMinPeak,
);

const convertThresEndPts = (feature, threshold) => {
  const {
    maxY, maxX, minX, thresRef,
  } = feature;

  const thresVal = threshold || thresRef || 0;
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
const readLayout = (jcamp) => {
  const { xType, spectra } = jcamp;
  if (xType && Format.isNmrLayout(xType)) return xType;
  const { dataType } = spectra[0];
  if (dataType) {
    if (dataType.includes('INFRARED SPECTRUM')) {
      return LIST_LAYOUT.IR;
    }
    if (dataType.includes('RAMAN SPECTRUM')) {
      return LIST_LAYOUT.RAMAN;
    }
    if (dataType.includes('UV/VIS SPECTRUM')) {
      if (dataType.includes('HPLC')) {
        return LIST_LAYOUT.HPLC_UVVIS;
      }
      return LIST_LAYOUT.UVVIS;
    }
    if (dataType.includes('THERMOGRAVIMETRIC ANALYSIS')) {
      return LIST_LAYOUT.TGA;
    }
    if (dataType.includes('X-RAY DIFFRACTION')) {
      return LIST_LAYOUT.XRD;
    }
    if (dataType.includes('MASS SPECTRUM')) {
      return LIST_LAYOUT.MS;
    }
    if (dataType.includes('CYCLIC VOLTAMMETRY')) {
      return LIST_LAYOUT.CYCLIC_VOLTAMMETRY;
    }
  }
  return false;
};

const extrSpectraShare = (spectra, layout) => (
  spectra.map(s => Object.assign({ layout }, s)).filter(r => r != null)
);

const extrSpectraMs = (jcamp, layout) => {
  const scanCount = jcamp.info.$CSSCANCOUNT || 1;
  const spc = extrSpectraShare(jcamp.spectra.slice(0, scanCount), layout);
  return spc || [];
};

const extrSpectraNi = (jcamp, layout) => {
  const categorys = jcamp.info.$CSCATEGORY || ['SPECTRUM'];
  const targetIdx = categorys.indexOf('SPECTRUM');
  const spectrum = extrSpectraShare(jcamp.spectra, layout)[targetIdx];
  return [spectrum] || [jcamp.spectra[0]];
};

const calcThresRef = (s, peakUp) => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref = peakUp ? Math.min(...ys.map(a => Math.abs(a))) : Math.max(...ys);
  return peakUp
    ? Math.floor(ref * 100 * 100 / s.maxY) / 100
    : Math.ceil(ref * 100 * 100 / s.maxY) / 100;
};

const calcUpperThres = (s) => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref =  Math.max(...ys);
  return Math.floor(ref * 100 * 100 / s.maxY) / 100;
};

const calcLowerThres = (s) => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref =  Math.min(...ys);
  return Math.ceil(ref * 100 * 100 / s.minY) / 100;
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

const extractVoltammetryData = (jcamp) => {
  const { info } = jcamp;
  if (!info.$CSCYCLICVOLTAMMETRYDATA) return null;
  const regx = /[^0-9.,E,e,-]/g;
  const rawData = info.$CSCYCLICVOLTAMMETRYDATA.split('\n');
  const peakStack = rawData.map((line) => {
    const splittedLine = line.replace(regx, '').split(',');
    return {
      max: {x: splittedLine[0], y: splittedLine[1]},
      min: {x: splittedLine[2], y: splittedLine[3]},
      ratio: splittedLine[4],
      delta: splittedLine[5],
      pecker: {x: splittedLine[6], y: splittedLine[7]},
    };
  });
  return peakStack;
};


const buildPeakFeature = (jcamp, layout, peakUp, s, thresRef, upperThres=false, lowerThres=false) => {
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
          layout,
          nucleus: xType || '',
        },
        observeFrequency: info['.OBSERVEFREQUENCY'],
        solventName: info['.SOLVENTNAME'],
        upperThres,
        lowerThres,
        volammetryData: extractVoltammetryData(jcamp),
      },
      s,
    )
  );
};

const calcIntgRefArea = (spectra, stack) => {
  if (stack.length === 0) return 1;
  const data = spectra[0].data[0];

  const xs = data.x;
  const ys = data.y;
  const maxY = maxArray(ys);

  const xyk = calcXYK(xs, ys, maxY, 0);
  const { xL, xU, area } = stack[0];
  const rawArea = getArea(xL, xU, xyk);
  const raw2realRatio = rawArea / area;
  return { raw2realRatio };
};

const maxArray = (arr) => {
  let len = arr.length;
    let max = -Infinity;

    while (len--) {
        max = arr[len] > max ? arr[len] : max;
    }
    return max;
}

const buildIntegFeature = (jcamp, spectra) => {
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
        absoluteArea: parseFloat(ts[3]),
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
  const { raw2realRatio } = calcIntgRefArea(spectra, stack);
  const mStack = stack.map(st => Object.assign({}, st, { area: st.area * raw2realRatio }));

  return (
    {
      refArea: raw2realRatio,
      refFactor: 1,
      shift: 0,
      stack: mStack,
      originStack: stack
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

const buildSimFeature = (jcamp) => {
  const { $CSSIMULATIONPEAKS } = jcamp.info;
  let nmrSimPeaks = $CSSIMULATIONPEAKS ? $CSSIMULATIONPEAKS.split('\n') : [];
  nmrSimPeaks = nmrSimPeaks.map(x => parseFloat(x).toFixed(2));
  return {
    nmrSimPeaks,
  };
};

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

const extrFeaturesNi = (jcamp, layout, peakUp, spectra) => {
  const nfs = {};
  const category = jcamp.info.$CSCATEGORY;
  if (category) {
    const idxEditPeak = category.indexOf('EDIT_PEAK');
    if (idxEditPeak >= 0) {
      const sEP = jcamp.spectra[idxEditPeak];
      const thresRef = calcThresRef(sEP, peakUp);
      nfs.editPeak = buildPeakFeature(jcamp, layout, peakUp, sEP, thresRef);
    }
    const idxAutoPeak = category.indexOf('AUTO_PEAK');
    if (idxAutoPeak >= 0) {
      const sAP = jcamp.spectra[idxAutoPeak];
      const thresRef = calcThresRef(sAP, peakUp);
      nfs.autoPeak = buildPeakFeature(jcamp, layout, peakUp, sAP, thresRef);
    }
    nfs.integration = buildIntegFeature(jcamp, spectra);
    nfs.multiplicity = buildMpyFeature(jcamp);
    nfs.simulation = buildSimFeature(jcamp);
    return nfs;
  }
  // workaround for legacy design
  const features = jcamp.spectra.map((s) => {
    const thresRef = calcThresRef(s, peakUp);
    return isPeakTable(s)
      ? buildPeakFeature(jcamp, layout, peakUp, s, thresRef)
      : null;
  }).filter(r => r != null);
  
  return { editPeak: features[0], autoPeak: features[1] };
  
};

const extrFeaturesXrd = (jcamp, layout, peakUp) => {
  const base = jcamp.spectra[0];

  const features = jcamp.spectra.map((s) => {
    const upperThres = Format.isXRDLayout(layout) ? 100 : calcUpperThres(s);
    const lowerThres = Format.isXRDLayout(layout) ? 100 : calcLowerThres(s);
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, 100, upperThres, lowerThres);
    const bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter(r => r != null);

  return features;
}


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

const extrFeaturesMs = (jcamp, layout, peakUp) => {
  // const nfs = {};
  // const category = jcamp.info.$CSCATEGORY;
  // const scanCount = parseInt(jcamp.info.$CSSCANCOUNT, 10) - 1;
  // if (category) {
  //   const idxEditPeak = category.indexOf('EDIT_PEAK');
  //   if (idxEditPeak >= 0) {
  //     const sEP = jcamp.spectra[idxEditPeak + scanCount];
  //     const thresRef = calcThresRef(sEP, peakUp);
  //     nfs.editPeak = buildPeakFeature(jcamp, layout, peakUp, sEP, thresRef);
  //   }
  //   const idxAutoPeak = category.indexOf('AUTO_PEAK');
  //   if (idxAutoPeak >= 0) {
  //     const sAP = jcamp.spectra[idxAutoPeak + scanCount];
  //     const thresRef = calcThresRef(sAP, peakUp);
  //     nfs.autoPeak = buildPeakFeature(jcamp, layout, peakUp, sAP, thresRef);
  //   }
  //   return nfs;
  // }
  // // workaround for legacy design
  const thresRef = (jcamp.info && jcamp.info.$CSTHRESHOLD * 100) || 5;
  const base = jcamp.spectra[0];

  const features = jcamp.spectra.map((s) => {
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, +thresRef.toFixed(4));
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
      keepRecordsRegExp: /(\$CSTHRESHOLD|\$CSSCANAUTOTARGET|\$CSSCANEDITTARGET|\$CSSCANCOUNT|\$CSSOLVENTNAME|\$CSSOLVENTVALUE|\$CSSOLVENTX|\$CSCATEGORY|\$CSITAREA|\$CSITFACTOR|\$OBSERVEDINTEGRALS|\$OBSERVEDMULTIPLETS|\$OBSERVEDMULTIPLETSPEAKS|\.SOLVENTNAME|\.OBSERVEFREQUENCY|\$CSSIMULATIONPEAKS|\$CSUPPERTHRESHOLD|\$CSLOWERTHRESHOLD|\$CSCYCLICVOLTAMMETRYDATA)/, // eslint-disable-line
    },
  );
  const layout = readLayout(jcamp);
  const peakUp = !Format.isIrLayout(layout);

  const spectra = Format.isMsLayout(layout)
    ? extrSpectraMs(jcamp, layout)
    : extrSpectraNi(jcamp, layout);
  // const features = Format.isMsLayout(layout)
  //   ? extrFeaturesMs(jcamp, layout, peakUp)
  //   : extrFeaturesNi(jcamp, layout, peakUp, spectra);
  const features = Format.isMsLayout(layout)
    ? extrFeaturesMs(jcamp, layout, peakUp)
    : ((Format.isXRDLayout(layout) || Format.isCyclicVoltaLayout(layout))
      ? extrFeaturesXrd(jcamp, layout, peakUp) : extrFeaturesNi(jcamp, layout, peakUp, spectra));

  return { spectra, features, layout };
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

const Convert2DValue = (doubleTheta, lambda=0.15406, isRadian=true) => {
  let theta = doubleTheta/2;
  if (isRadian) {
    theta = (theta/180)*Math.PI;
  }
  const sinTheta = Math.sin(theta);
  const dValue = lambda/(2*sinTheta);
  return dValue;
};

const GetCyclicVoltaRatio = (y_max_peak, y_min_peak, y_pecker) => {
  const firstExpr = Math.abs(y_min_peak) / Math.abs(y_max_peak);
  const secondExpr = 0.485 * Math.abs(y_pecker) / Math.abs(y_max_peak);
  const ratio = firstExpr + secondExpr + 0.086;
  return ratio;
};

const GetCyclicVoltaPeakSeparate = (x_max_peak, x_min_peak) => {
  const delta = Math.abs(x_max_peak - x_min_peak);
  return delta;
};

export {
  ExtractJcamp, Topic2Seed, Feature2Peak,
  ToThresEndPts, ToShiftPeaks, ToFrequency,
  Convert2Peak, Convert2Scan, Convert2Thres,
  GetComparisons, Convert2DValue,
  GetCyclicVoltaRatio, GetCyclicVoltaPeakSeparate,
  Feature2MaxMinPeak, convertTopic, Convert2MaxMinPeak
};
