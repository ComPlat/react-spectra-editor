"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertTopic = exports.Topic2Seed = exports.ToThresEndPts = exports.ToShiftPeaks = exports.ToFrequency = exports.GetCyclicVoltaRatio = exports.GetCyclicVoltaPeakSeparate = exports.GetComparisons = exports.Feature2Peak = exports.Feature2MaxMinPeak = exports.ExtractJcamp = exports.Convert2Thres = exports.Convert2Scan = exports.Convert2Peak = exports.Convert2MaxMinPeak = exports.Convert2DValue = void 0;
var _jcampconverter = _interopRequireDefault(require("jcampconverter"));
var _reselect = require("reselect");
var _shift = require("./shift");
var _cfg = _interopRequireDefault(require("./cfg"));
var _format = _interopRequireDefault(require("./format"));
var _list_layout = require("../constants/list_layout");
var _integration = require("./integration");
/* eslint-disable
no-mixed-operators, react/function-component-definition,
prefer-object-spread, camelcase,  no-plusplus */

const getTopic = (_, props) => props.topic;
const getFeature = (_, props) => props.feature;
const getLayout = (state, _) => state.layout; // eslint-disable-line

const getShiftOffset = (state, _) => {
  // eslint-disable-line
  const {
    curve,
    shift
  } = state;
  const {
    curveIdx
  } = curve;
  const {
    shifts
  } = shift;
  const selectedShift = shifts[curveIdx];
  if (!selectedShift) {
    return 0.0;
  }

  // const { shift } = state;
  const {
    ref,
    peak
  } = selectedShift;
  return (0, _shift.FromManualToOffset)(ref, peak);
};
const calcXYK = (xs, ys, maxY, offset) => {
  const sp = [];
  let k = 0;
  for (let i = 0; i < ys.length; i += 1) {
    // no-downsample
    const x = xs[i] - offset;
    const y = ys[i];
    const cy = y / maxY;
    if (cy > 0.0) {
      k += cy;
    }
    sp.push({
      x,
      y,
      k
    });
  }
  return sp;
};
const calcXY = (xs, ys, maxY, offset) => {
  const sp = [];
  for (let i = 0; i < ys.length; i += 1) {
    // no-downsample
    const x = xs[i] - offset;
    const y = ys[i];
    sp.push({
      x,
      y
    });
  }
  return sp;
};
const convertTopic = (topic, layout, feature, offset) => {
  const {
    maxY
  } = feature;
  const xs = topic.x;
  const ys = topic.y;
  const isItgDisable = _cfg.default.btnCmdIntg(layout);
  if (!isItgDisable) return calcXYK(xs, ys, maxY, offset);
  return calcXY(xs, ys, maxY, offset);
};
exports.convertTopic = convertTopic;
const Topic2Seed = exports.Topic2Seed = (0, _reselect.createSelector)(getTopic, getLayout, getFeature, getShiftOffset, convertTopic);
const getOthers = (_, props) => props.comparisons;
const calcRescaleXY = (xs, ys, minY, maxY, show) => {
  const sp = [];
  if (xs.length < 1) return sp;
  const [lowerY, upperY] = [Math.min(...ys), Math.max(...ys)];
  const faktor = (maxY - minY) / (upperY - lowerY);
  for (let i = 0; i < ys.length; i += 2) {
    // downsample
    const x = xs[i];
    const y = (ys[i] - lowerY) * faktor + minY;
    sp.push({
      x,
      y
    });
  }
  return {
    data: sp,
    show
  };
};
const convertComparisons = (layout, comparisons, feature) => {
  const {
    minY,
    maxY
  } = feature;
  if (!comparisons || !(_format.default.isIrLayout(layout) || _format.default.isHplcUvVisLayout(layout) || _format.default.isXRDLayout(layout))) return [];
  return comparisons.map(c => {
    const {
      spectra,
      show
    } = c;
    const topic = spectra[0].data[0];
    const xs = topic.x;
    const ys = topic.y;
    return calcRescaleXY(xs, ys, minY, maxY, show);
  });
};
const GetComparisons = exports.GetComparisons = (0, _reselect.createSelector)(getLayout, getOthers, getFeature, convertComparisons);
const convertFrequency = (layout, feature) => {
  if (['1H', '13C', '19F', '31P', '15N', '29Si'].indexOf(layout) < 0) return false;
  const {
    observeFrequency
  } = feature;
  const freq = Array.isArray(observeFrequency) ? observeFrequency[0] : observeFrequency;
  return parseFloat(freq) || false;
};
const ToFrequency = exports.ToFrequency = (0, _reselect.createSelector)(getLayout, getFeature, convertFrequency);
const getThreshold = state => state.threshold ? state.threshold.value * 1.0 : false;
const Convert2Peak = function (feature, threshold, offset) {
  let upThreshold = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let lowThreshold = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  const peak = [];
  if (!feature || !feature.data) return peak;
  const data = feature.data[0];
  const {
    maxY,
    peakUp,
    thresRef,
    minY,
    upperThres,
    lowerThres,
    operation
  } = feature;
  const {
    layout
  } = operation;

  // if (!Format.isSECLayout(layout) && (upperThres || lowerThres)) {
  if ((_format.default.isCyclicVoltaLayout(layout) || _format.default.isCDSLayout(layout)) && (upperThres || lowerThres)) {
    let upperThresVal = upThreshold || upperThres;
    if (!upperThresVal) {
      upperThresVal = 1.0;
    }
    let lowerThresVal = lowThreshold || lowerThres;
    if (!lowerThresVal) {
      lowerThresVal = 1.0;
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
        peak.push({
          x,
          y
        });
      }
    }
    return peak;
  }
  const thresVal = threshold || thresRef;
  const yThres = Number.parseFloat((thresVal * maxY / 100.0).toFixed(10));
  const corrOffset = offset || 0.0;
  for (let i = 0; i < data.y.length; i += 1) {
    const y = data.y[i];
    const overThres = peakUp && Math.abs(y) >= yThres || !peakUp && Math.abs(y) <= yThres;
    if (overThres) {
      const x = data.x[i] - corrOffset;
      peak.push({
        x,
        y
      });
    }
  }
  return peak;
};
exports.Convert2Peak = Convert2Peak;
const Feature2Peak = exports.Feature2Peak = (0, _reselect.createSelector)(getFeature, getThreshold, getShiftOffset, Convert2Peak);
const Convert2MaxMinPeak = (layout, feature, offset) => {
  const peaks = {
    max: [],
    min: [],
    pecker: []
  };
  if (!_format.default.isCyclicVoltaLayout(layout) || !feature || !feature.data) return null; // eslint-disable-line
  const data = feature.data[0]; // eslint-disable-line
  const {
    maxY,
    minY,
    upperThres,
    lowerThres,
    volammetryData
  } = feature;
  if (volammetryData && volammetryData.length > 0) {
    const maxArr = volammetryData.map(peakData => {
      if (peakData.max.x === '') return null;
      return {
        x: Number(peakData.max.x),
        y: Number(peakData.max.y)
      };
    });
    const minArr = volammetryData.map(peakData => {
      if (peakData.min.x === '') return null;
      return {
        x: Number(peakData.min.x),
        y: Number(peakData.min.y)
      };
    });
    const peckerArr = volammetryData.map(peakData => {
      if (peakData.pecker.x === '') return null;
      return {
        x: Number(peakData.pecker.x),
        y: Number(peakData.pecker.y)
      };
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
    lowerThresVal = 1.0;
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
      peaks.max.push({
        x,
        y
      });
    } else if (belowThres) {
      peaks.min.push({
        x,
        y
      });
    }
  }
  return peaks;
};
exports.Convert2MaxMinPeak = Convert2MaxMinPeak;
const Feature2MaxMinPeak = exports.Feature2MaxMinPeak = (0, _reselect.createSelector)(getLayout, getFeature, getShiftOffset, Convert2MaxMinPeak);
const convertThresEndPts = (feature, threshold) => {
  const {
    maxY,
    maxX,
    minX,
    thresRef
  } = feature;
  const thresVal = threshold || thresRef || 0;
  if (!thresVal || !feature.data) return [];
  const yThres = thresVal * maxY / 100.0;
  const endPts = [{
    x: minX - 200,
    y: yThres
  }, {
    x: maxX + 200,
    y: yThres
  }];
  return endPts;
};
const ToThresEndPts = exports.ToThresEndPts = (0, _reselect.createSelector)(getFeature, getThreshold, convertThresEndPts);
const getShiftPeak = state => {
  const {
    curve,
    shift
  } = state;
  const {
    curveIdx
  } = curve;
  const {
    shifts
  } = shift;
  const selectedShift = shifts[curveIdx];
  if (!selectedShift) {
    return false;
  }
  return selectedShift.peak;
};
const convertSfPeaks = (peak, offset) => {
  if (!peak || !peak.x) return [];
  return [{
    x: peak.x - offset,
    y: peak.y
  }];
};
const ToShiftPeaks = exports.ToShiftPeaks = (0, _reselect.createSelector)(getShiftPeak, getShiftOffset, convertSfPeaks);

// - - - - - - - - - - - - - - - - - - - - - -
// ExtractJcamp
// - - - - - - - - - - - - - - - - - - - - - -
const readLayout = jcamp => {
  const {
    xType,
    spectra
  } = jcamp;
  if (xType && _format.default.isNmrLayout(xType)) return xType;
  const {
    dataType
  } = spectra[0];
  if (dataType) {
    if (dataType.includes('INFRARED SPECTRUM')) {
      return _list_layout.LIST_LAYOUT.IR;
    }
    if (dataType.includes('RAMAN SPECTRUM')) {
      return _list_layout.LIST_LAYOUT.RAMAN;
    }
    if (dataType.includes('UV/VIS SPECTRUM')) {
      if (dataType.includes('HPLC')) {
        return _list_layout.LIST_LAYOUT.HPLC_UVVIS;
      }
      return _list_layout.LIST_LAYOUT.UVVIS;
    }
    if (dataType.includes('THERMOGRAVIMETRIC ANALYSIS')) {
      return _list_layout.LIST_LAYOUT.TGA;
    }
    if (dataType.includes('X-RAY DIFFRACTION')) {
      return _list_layout.LIST_LAYOUT.XRD;
    }
    if (dataType.includes('MASS SPECTRUM')) {
      return _list_layout.LIST_LAYOUT.MS;
    }
    if (dataType.includes('CYCLIC VOLTAMMETRY')) {
      return _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY;
    }
    if (dataType.includes('CIRCULAR DICHROISM SPECTROSCOPY')) {
      return _list_layout.LIST_LAYOUT.CDS;
    }
    if (dataType.includes('SIZE EXCLUSION CHROMATOGRAPHY')) {
      return _list_layout.LIST_LAYOUT.SEC;
    }
    if (dataType.includes('SORPTION-DESORPTION MEASUREMENT')) {
      return _list_layout.LIST_LAYOUT.AIF;
    }
    if (dataType.includes('Emissions')) {
      return _list_layout.LIST_LAYOUT.EMISSIONS;
    }
    if (dataType.includes('DLS ACF')) {
      return _list_layout.LIST_LAYOUT.DLS_ACF;
    }
    if (dataType.includes('DLS intensity')) {
      return _list_layout.LIST_LAYOUT.DLS_INTENSITY;
    }
  }
  return false;
};
const extrSpectraShare = (spectra, layout) => spectra.map(s => Object.assign({
  layout
}, s)).filter(r => r != null);
const extrSpectraMs = (jcamp, layout) => {
  const scanCount = jcamp.info.$CSSCANCOUNT || 1;
  const spc = extrSpectraShare(jcamp.spectra.slice(0, scanCount), layout);
  let spectra = spc || [];
  if (jcamp.info.UNITS && jcamp.info.SYMBOL) {
    const units = jcamp.info.UNITS.split(',');
    const symbol = jcamp.info.SYMBOL.split(',');
    let xUnit = null;
    let yUnit = null;
    symbol.forEach((sym, idx) => {
      const currSymbol = sym.replace(' ', '').toLowerCase();
      if (currSymbol === 'x') {
        xUnit = units[idx].trim();
      } else if (currSymbol === 'y') {
        yUnit = units[idx].trim();
      }
    });
    spectra = spectra.map(sp => {
      const spectrum = sp;
      if (xUnit) {
        spectrum.xUnit = xUnit;
      }
      if (yUnit) {
        spectrum.yUnit = yUnit;
      }
      return spectrum;
    });
  }
  return spectra;
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
  return peakUp ? Math.floor(ref * 100 * 100 / s.maxY) / 100 : Math.ceil(ref * 100 * 100 / s.maxY) / 100;
};
const calcUpperThres = s => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref = Math.max(...ys);
  return Math.floor(ref * 100 * 100 / s.maxY) / 100;
};
const calcLowerThres = s => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref = Math.min(...ys);
  return Math.ceil(ref * 100 * 100 / s.minY) / 100;
};
const extractShift = (s, jcamp) => {
  const shift = {
    selectX: false,
    solventName: false,
    solventValue: false
  };
  if (!s) return shift;
  if (s && s.sampleDescription) {
    const desc = s.sampleDescription;
    const info = desc.split(/;|=/);
    return {
      selectX: parseFloat(info[1]),
      solventName: info[3],
      solventValue: parseFloat(info[5])
    };
  }
  return {
    selectX: parseFloat(jcamp.info.$CSSOLVENTX) || false,
    solventName: jcamp.info.$CSSOLVENTNAME || false,
    solventValue: parseFloat(jcamp.info.$CSSOLVENTVALUE) || false
  };
};
const extractVoltammetryData = jcamp => {
  const {
    info
  } = jcamp;
  if (!info.$CSCYCLICVOLTAMMETRYDATA) return null;
  const regx = /[^0-9.,E,e,-]/g;
  const rawData = info.$CSCYCLICVOLTAMMETRYDATA.split('\n');
  const peakStack = rawData.map(line => {
    const splittedLine = line.replace(regx, '').split(',');
    return {
      max: {
        x: splittedLine[0],
        y: splittedLine[1]
      },
      min: {
        x: splittedLine[2],
        y: splittedLine[3]
      },
      ratio: splittedLine[4],
      delta: splittedLine[5],
      pecker: {
        x: splittedLine[6],
        y: splittedLine[7]
      }
    };
  });
  return peakStack;
};
const buildPeakFeature = function (jcamp, layout, peakUp, s, thresRef) {
  let upperThres = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  let lowerThres = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  // eslint-disable-line
  const {
    xType,
    info
  } = jcamp;
  const subTyp = xType ? ` - ${xType}` : '';
  return Object.assign({
    typ: s.dataType + subTyp,
    peakUp,
    thresRef,
    scanCount: +info.$CSSCANCOUNT,
    scanAutoTarget: +info.$CSSCANAUTOTARGET,
    scanEditTarget: +info.$CSSCANEDITTARGET,
    shift: extractShift(s, jcamp),
    operation: {
      layout,
      nucleus: xType || ''
    },
    observeFrequency: info['.OBSERVEFREQUENCY'],
    solventName: info['.SOLVENTNAME'],
    upperThres,
    lowerThres,
    volammetryData: extractVoltammetryData(jcamp)
  }, s);
};
const maxArray = arr => {
  let len = arr.length;
  let max = -Infinity;
  while (len--) {
    max = arr[len] > max ? arr[len] : max;
  }
  return max;
};
const calcIntgRefArea = (spectra, stack) => {
  if (stack.length === 0) return 1;
  const data = spectra[0].data[0];
  const xs = data.x;
  const ys = data.y;
  const maxY = maxArray(ys);
  const xyk = calcXYK(xs, ys, maxY, 0);
  const {
    xL,
    xU,
    area
  } = stack[0];
  const rawArea = (0, _integration.getArea)(xL, xU, xyk);
  const raw2realRatio = rawArea / area;
  return {
    raw2realRatio
  };
};
const buildIntegFeature = (jcamp, spectra) => {
  const {
    $OBSERVEDINTEGRALS,
    $OBSERVEDMULTIPLETS
  } = jcamp.info;
  const regx = /[^0-9.,-]/g;
  let stack = [];
  if ($OBSERVEDINTEGRALS) {
    const its = $OBSERVEDINTEGRALS.split('\n').slice(1);
    const itStack = its.map(t => {
      const ts = t.replace(regx, '').split(',');
      return {
        xL: parseFloat(ts[0]),
        xU: parseFloat(ts[1]),
        area: parseFloat(ts[2]),
        absoluteArea: parseFloat(ts[3])
      };
    });
    stack = [...stack, ...itStack];
  }
  if ($OBSERVEDMULTIPLETS) {
    const mps = $OBSERVEDMULTIPLETS.split('\n');
    const mpStack = mps.map(m => {
      const ms = m.replace(regx, '').split(',');
      return {
        xL: parseFloat(ms[1]),
        xU: parseFloat(ms[2]),
        area: parseFloat(ms[4])
      };
    });
    stack = [...stack, ...mpStack];
  }
  const {
    raw2realRatio
  } = calcIntgRefArea(spectra, stack);
  const mStack = stack.map(st => Object.assign({}, st, {
    area: st.area * raw2realRatio
  }));
  return {
    refArea: raw2realRatio,
    refFactor: 1,
    shift: 0,
    stack: mStack,
    originStack: stack
  };
};

/*
const range = (head, tail, length) => {
  const actTail = tail || length - 1;
  return (
    Array(actTail - head + 1).fill().map((_, idx) => head + idx)
  );
};
*/

const buildSimFeature = jcamp => {
  const {
    $CSSIMULATIONPEAKS
  } = jcamp.info;
  let nmrSimPeaks = $CSSIMULATIONPEAKS ? $CSSIMULATIONPEAKS.split('\n') : [];
  nmrSimPeaks = nmrSimPeaks.map(x => parseFloat(x).toFixed(2));
  return {
    nmrSimPeaks
  };
};
const buildMpyFeature = jcamp => {
  const {
    $OBSERVEDMULTIPLETS,
    $OBSERVEDMULTIPLETSPEAKS
  } = jcamp.info;
  const regx = /[^A-Za-z0-9.,-]/g;
  const regxNum = /[^0-9.]/g;
  let stack = [];
  if (!$OBSERVEDMULTIPLETSPEAKS) return {
    stack: []
  };
  const allPeaks = $OBSERVEDMULTIPLETSPEAKS.split('\n').map(p => p.replace(regx, '').split(','));
  if ($OBSERVEDMULTIPLETS) {
    const mp = $OBSERVEDMULTIPLETS.split('\n');
    const mpStack = mp.map(m => {
      const ms = m.replace(regx, '').split(',');
      const idx = ms[0];
      let ys = [];
      const peaks = allPeaks.map(p => {
        if (p[0] === idx) {
          ys = [...ys, parseFloat(p[2])];
          return {
            x: parseFloat(p[1]),
            y: parseFloat(p[2])
          };
        }
        return null;
      }).filter(r => r != null);
      let js = m.split(',');
      js = js[js.length - 1].split(' ').map(j => parseFloat(j.replace(regxNum, ''))).filter(Boolean);
      return {
        js,
        mpyType: ms[6],
        xExtent: {
          xL: parseFloat(ms[1]),
          xU: parseFloat(ms[2])
        },
        yExtent: {
          yL: Math.min(...ys),
          yU: Math.max(...ys)
        },
        peaks
      };
    });
    stack = [...stack, ...mpStack];
  }
  return {
    stack,
    shift: 0,
    smExtext: false
  };
};
const isPeakTable = s => s.dataType && (s.dataType.includes('PEAKTABLE') || s.dataType.includes('PEAK ASSIGNMENTS'));
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
  const features = jcamp.spectra.map(s => {
    const thresRef = calcThresRef(s, peakUp);
    return isPeakTable(s) ? buildPeakFeature(jcamp, layout, peakUp, s, thresRef) : null;
  }).filter(r => r != null);
  const integration = buildIntegFeature(jcamp, spectra);
  const multiplicity = buildMpyFeature(jcamp);
  const simulation = buildSimFeature(jcamp);
  return {
    editPeak: features[0],
    autoPeak: features[1],
    integration,
    multiplicity,
    simulation
  };
};
const getBoundary = s => {
  const {
    x,
    y
  } = s.data[0];
  const maxX = Math.max(...x);
  const minX = Math.min(...x);
  const maxY = Math.max(...y);
  const minY = Math.min(...y);
  return {
    maxX,
    minX,
    maxY,
    minY
  };
};
const extrFeaturesXrd = (jcamp, layout, peakUp) => {
  const base = jcamp.spectra[0];
  const features = jcamp.spectra.map(s => {
    const upperThres = _format.default.isXRDLayout(layout) ? 100 : calcUpperThres(s);
    const lowerThres = _format.default.isXRDLayout(layout) ? 100 : calcLowerThres(s);
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, 100, upperThres, lowerThres);
    const bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter(r => r != null);
  const category = jcamp.info.$CSCATEGORY;
  if (category) {
    const idxEditPeak = category.indexOf('EDIT_PEAK');
    if (idxEditPeak >= 0) {
      const sEP = jcamp.spectra[idxEditPeak];
      const thresRef = calcThresRef(sEP, peakUp);
      features.editPeak = buildPeakFeature(jcamp, layout, peakUp, sEP, thresRef);
    }
    const idxAutoPeak = category.indexOf('AUTO_PEAK');
    if (idxAutoPeak >= 0) {
      const sAP = jcamp.spectra[idxAutoPeak];
      const thresRef = calcThresRef(sAP, peakUp);
      features.autoPeak = buildPeakFeature(jcamp, layout, peakUp, sAP, thresRef);
    }
  }
  return features;
};
const extrFeaturesCylicVolta = (jcamp, layout, peakUp) => {
  const base = jcamp.spectra[0];
  const features = jcamp.spectra.map(s => {
    const upperThres = _format.default.isXRDLayout(layout) ? 100 : calcUpperThres(s);
    const lowerThres = _format.default.isXRDLayout(layout) ? 100 : calcLowerThres(s);
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, 100, upperThres, lowerThres);
    const bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter(r => r != null);
  return features;
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
  const thresRef = jcamp.info && jcamp.info.$CSTHRESHOLD * 100 || 5;
  const base = jcamp.spectra[0];
  const features = jcamp.spectra.map(s => {
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, +thresRef.toFixed(4));
    const bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter(r => r != null);
  return features;
};
const ExtractJcamp = source => {
  const jcamp = _jcampconverter.default.convert(source, {
    xy: true,
    keepRecordsRegExp: /(\$CSTHRESHOLD|\$CSSCANAUTOTARGET|\$CSSCANEDITTARGET|\$CSSCANCOUNT|\$CSSOLVENTNAME|\$CSSOLVENTVALUE|\$CSSOLVENTX|\$CSCATEGORY|\$CSITAREA|\$CSITFACTOR|\$OBSERVEDINTEGRALS|\$OBSERVEDMULTIPLETS|\$OBSERVEDMULTIPLETSPEAKS|\.SOLVENTNAME|\.OBSERVEFREQUENCY|\$CSSIMULATIONPEAKS|\$CSUPPERTHRESHOLD|\$CSLOWERTHRESHOLD|\$CSCYCLICVOLTAMMETRYDATA|UNITS|SYMBOL)/ // eslint-disable-line
  });

  const layout = readLayout(jcamp);
  const peakUp = !_format.default.isIrLayout(layout);
  const spectra = _format.default.isMsLayout(layout) ? extrSpectraMs(jcamp, layout) : extrSpectraNi(jcamp, layout);
  let features = {};
  if (_format.default.isMsLayout(layout)) {
    features = extrFeaturesMs(jcamp, layout, peakUp);
  } else if (_format.default.isXRDLayout(layout)) {
    features = extrFeaturesXrd(jcamp, layout, peakUp);
  } else if (_format.default.isCyclicVoltaLayout(layout) || _format.default.isSECLayout(layout) || _format.default.isAIFLayout(layout) || _format.default.isCDSLayout(layout)) {
    features = extrFeaturesCylicVolta(jcamp, layout, peakUp);
  } else {
    features = extrFeaturesNi(jcamp, layout, peakUp, spectra);
  }
  // const features = Format.isMsLayout(layout)
  //   ? extrFeaturesMs(jcamp, layout, peakUp)
  //   : ((Format.isXRDLayout(layout) || Format.isCyclicVoltaLayout(layout))
  //     ? extrFeaturesXrd(jcamp, layout, peakUp) : extrFeaturesNi(jcamp, layout, peakUp, spectra));

  return {
    spectra,
    features,
    layout
  };
};
exports.ExtractJcamp = ExtractJcamp;
const Convert2Scan = (feature, scanSt) => {
  const {
    scanAutoTarget,
    scanEditTarget
  } = feature;
  const {
    target,
    isAuto
  } = scanSt;
  const hasEdit = !!scanEditTarget;
  const defaultIdx = isAuto || !hasEdit ? scanAutoTarget : scanEditTarget;
  return target || defaultIdx;
};
exports.Convert2Scan = Convert2Scan;
const Convert2Thres = (feature, thresSt) => {
  const value = thresSt.value || feature.thresRef;
  return value;
};
exports.Convert2Thres = Convert2Thres;
const Convert2DValue = function (doubleTheta) {
  let lambda = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.15406;
  let isRadian = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let theta = doubleTheta / 2;
  if (isRadian) {
    theta = theta / 180 * Math.PI;
  }
  const sinTheta = Math.sin(theta);
  const dValue = lambda / (2 * sinTheta);
  return dValue;
};
exports.Convert2DValue = Convert2DValue;
const GetCyclicVoltaRatio = (y_max_peak, y_min_peak, y_pecker) => {
  const firstExpr = Math.abs(y_min_peak) / Math.abs(y_max_peak);
  const secondExpr = 0.485 * Math.abs(y_pecker) / Math.abs(y_max_peak);
  const ratio = firstExpr + secondExpr + 0.086;
  return ratio;
};
exports.GetCyclicVoltaRatio = GetCyclicVoltaRatio;
const GetCyclicVoltaPeakSeparate = (x_max_peak, x_min_peak) => {
  const delta = Math.abs(x_max_peak - x_min_peak);
  return delta;
};
exports.GetCyclicVoltaPeakSeparate = GetCyclicVoltaPeakSeparate;