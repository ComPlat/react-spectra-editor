/* eslint-disable
no-mixed-operators, react/function-component-definition,
prefer-object-spread, camelcase,  no-plusplus, prefer-destructuring,
max-len */
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

const GetCyclicVoltaShiftOffset = (volammetryData = null, curveIdx = 0) => {
  if (!volammetryData) return 0.0;
  const { spectraList } = volammetryData;
  const spectra = spectraList[curveIdx];
  if (!spectra) return 0.0;
  const { shift } = spectra;
  const { ref, val } = shift;
  if (!ref) return 0.0;
  const { e12 } = ref;
  return e12 - val;
};

const getShiftOffset = (state, _) => { // eslint-disable-line
  const {
    curve, layout, cyclicvolta,
  } = state;
  const { curveIdx } = curve;
  if (layout === LIST_LAYOUT.CYCLIC_VOLTAMMETRY && cyclicvolta) {
    return GetCyclicVoltaShiftOffset(cyclicvolta, curveIdx);
  }

  const { shift } = state;
  const { shifts } = shift;
  const selectedShift = shifts[curveIdx];
  if (!selectedShift) {
    return 0.0;
  }

  const { ref, peak } = selectedShift;
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
  if (!comparisons || !(Format.isIrLayout(layout)
  || Format.isHplcUvVisLayout(layout) || Format.isXRDLayout(layout))) return [];
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

const getThreshold = (state) => (
  state.threshold ? state.threshold.list[state.curve.curveIdx].value * 1.0 : false
);

const Convert2Peak = (feature, threshold, offset, upThreshold = false, lowThreshold = false) => {
  if (feature?.operation?.layout === 'LC/MS') {
    const data = feature.data[0];
    if (!data) return [];

    const { x, y } = data;
    const peaks = [];
    const maxIntensity = Math.max(...y);

    const thresholdValue = threshold || 0;
    for (let i = 1; i < y.length - 1; i++) {
      const intensity = (y[i] / maxIntensity) * 100;
      if (intensity >= thresholdValue && y[i] > y[i - 1] && y[i] > y[i + 1]) {
        peaks.push({
          x: x[i],
          y: y[i],
        });
      }
    }

    return peaks;
  }

  const peak = [];
  if (!feature || !feature.data) return peak;
  const data = feature.data[0];
  const {
    maxY, peakUp, thresRef, minY, upperThres, lowerThres, operation,
  } = feature;
  const { layout } = operation;

  if (Format.isLCMsLayout(layout) && feature.peaks) {
    return feature.peaks.map((p) => ({
      x: p.x - (offset || 0),
      y: p.y,
    }));
  }

  if ((Format.isCyclicVoltaLayout(layout) || Format.isCDSLayout(layout))
  && (upperThres || lowerThres)) {
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
        peak.push({ x, y });
      }
    }
    return peak;
  }
  const thresVal = threshold || thresRef;
  const yThres = Number.parseFloat((thresVal * maxY / 100.0).toFixed(10));
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
};

const Feature2Peak = createSelector(
  getFeature,
  getThreshold,
  getShiftOffset,
  Convert2Peak,
);

const Convert2MaxMinPeak = (layout, feature, offset) => {  // eslint-disable-line
  const peaks = {
    max: [], min: [], pecker: [], refIndex: -1,
  };
  if (!Format.isCyclicVoltaLayout(layout) || !feature || !feature.data) return null;  // eslint-disable-line
  // const data = feature.data[0]; // eslint-disable-line
  const {
    volammetryData,
  } = feature;

  if (volammetryData && volammetryData.length > 0) {
    const maxArr = volammetryData.map((peakData) => {
      // peaks.refIndex = peakData.isRef === true ? idx : -1;
      if (peakData.max.x === '') return null;
      return { x: Number(peakData.max.x), y: Number(peakData.max.y) };
    });
    const minArr = volammetryData.map((peakData) => {
      if (peakData.min.x === '') return null;
      return { x: Number(peakData.min.x), y: Number(peakData.min.y) };
    });
    const peckerArr = volammetryData.map((peakData) => {
      if (peakData.pecker.x === '') return null;
      return { x: Number(peakData.pecker.x), y: Number(peakData.pecker.y) };
    });
    const refIndex = volammetryData.findIndex((peakData) => peakData.isRef === true);

    peaks.max = maxArr;
    peaks.min = minArr;
    peaks.pecker = peckerArr;
    peaks.refIndex = refIndex;
    return peaks;
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

const getShiftPeak = (state) => {
  const { curve, shift } = state;
  const { curveIdx } = curve;
  const { shifts } = shift;
  const selectedShift = shifts[curveIdx];
  if (!selectedShift) {
    return false;
  }
  return selectedShift.peak;
};

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
    if (dataType.includes('DIFFERENTIAL SCANNING CALORIMETRY')) {
      return LIST_LAYOUT.DSC;
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
    if (dataType.includes('CIRCULAR DICHROISM SPECTROSCOPY')) {
      return LIST_LAYOUT.CDS;
    }
    if (dataType.includes('SIZE EXCLUSION CHROMATOGRAPHY')) {
      return LIST_LAYOUT.SEC;
    }
    if (dataType.includes('GAS CHROMATOGRAPHY')) {
      return LIST_LAYOUT.GC;
    }
    if (dataType.includes('SORPTION-DESORPTION MEASUREMENT')) {
      return LIST_LAYOUT.AIF;
    }
    if (dataType.includes('Emissions')) {
      return LIST_LAYOUT.EMISSIONS;
    }
    if (dataType.includes('DLS ACF')) {
      return LIST_LAYOUT.DLS_ACF;
    }
    if (dataType.includes('DLS intensity')) {
      return LIST_LAYOUT.DLS_INTENSITY;
    }
    if (dataType.includes('LC/MS')) {
      return LIST_LAYOUT.LC_MS;
    }
  }
  return false;
};

const extrSpectraShare = (spectra, layout) => (
  spectra.map((s) => Object.assign({ layout }, s)).filter((r) => r != null)
);

const extrSpectraMs = (jcamp, layout) => {
  const scanCount = jcamp.info.$CSSCANCOUNT || 1;
  const spc = extrSpectraShare(jcamp.spectra.slice(0, scanCount), layout);
  let spectra = spc || [];
  if (Format.isLCMsLayout(layout)) {
    spectra = spectra.map((spectrum) => {
      const { data } = spectrum;
      if (!data || !data[0]) return spectrum;

      const { x, y } = data[0];
      const peaks = [];

      for (let i = 1; i < y.length - 1; i++) {
        if (y[i] > y[i - 1] && y[i] > y[i + 1]) {
          peaks.push({
            x: x[i],
            y: y[i],
          });
        }
      }

      return {
        ...spectrum,
        peaks,
        data: {
          x: data[0].x,
          y: data[0].y,
        },
      };
    });
  }

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

    spectra = spectra.map((sp) => {
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
  const ref = peakUp ? Math.min(...ys.map((a) => Math.abs(a))) : Math.max(...ys);
  return peakUp
    ? Math.floor(ref * 100 * 100 / s.maxY) / 100
    : Math.ceil(ref * 100 * 100 / s.maxY) / 100;
};

const calcUpperThres = (s) => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref = Math.max(...ys);
  return Math.floor(ref * 100 * 100 / s.maxY) / 100;
};

const calcLowerThres = (s) => {
  const ys = s && s.data[0].y;
  if (!ys) return null;
  const ref = Math.min(...ys);
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
    const isRef = (splittedLine.length > 8 && splittedLine[8] === '1');
    return {
      max: { x: splittedLine[0], y: splittedLine[1] },
      min: { x: splittedLine[2], y: splittedLine[3] },
      ratio: splittedLine[4],
      delta: splittedLine[5],
      pecker: { x: splittedLine[6], y: splittedLine[7] },
      isRef,
    };
  });
  return peakStack;
};

const buildPeakFeature = (jcamp, layout, peakUp, s, thresRef, upperThres = false, lowerThres = false) => {
  const { xType, info } = jcamp;
  const subTyp = xType ? ` - ${xType}` : '';

  const baseFeature = {
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
    scanRate: +info.$CSSCANRATE || 0.1,
    csCategory: info.$CSCATEGORY,
  };

  if (layout === 'LC/MS' && s.peaks) {
    baseFeature.peaks = s.peaks;
  }

  return Object.assign({}, baseFeature, s);
};

const maxArray = (arr) => {
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
  const { xL, xU, area } = stack[0];
  const rawArea = getArea(xL, xU, xyk);
  const raw2realRatio = rawArea / area;
  return { raw2realRatio };
};

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
  const mStack = stack.map((st) => Object.assign({}, st, { area: st.area * raw2realRatio }));

  return (
    {
      refArea: raw2realRatio,
      refFactor: 1,
      shift: 0,
      stack: mStack,
      originStack: stack,
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
  nmrSimPeaks = nmrSimPeaks.map((x) => parseFloat(x).toFixed(2));
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
    (p) => p.replace(regx, '').split(','),
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
      }).filter((r) => r != null);
      let js = m.split(',');
      js = js[js.length - 1].split(' ')
        .map((j) => parseFloat(j.replace(regxNum, '')))
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

const isPeakTable = (s) => (
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
  }).filter((r) => r != null);

  const integration = buildIntegFeature(jcamp, spectra);
  const multiplicity = buildMpyFeature(jcamp);
  const simulation = buildSimFeature(jcamp);

  return {
    editPeak: features[0], autoPeak: features[1], integration, multiplicity, simulation,
  };
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

const extrFeaturesXrd = (jcamp, layout, peakUp) => {
  const base = jcamp.spectra[0];

  const features = jcamp.spectra.map((s) => {
    const upperThres = Format.isXRDLayout(layout) ? 100 : calcUpperThres(s);
    const lowerThres = Format.isXRDLayout(layout) ? 100 : calcLowerThres(s);
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, 100, upperThres, lowerThres);
    const bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter((r) => r != null);

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

  const features = jcamp.spectra.map((s) => {
    const upperThres = Format.isXRDLayout(layout) ? 100 : calcUpperThres(s);
    const lowerThres = Format.isXRDLayout(layout) ? 100 : calcLowerThres(s);
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, 100, upperThres, lowerThres);
    const bnd = getBoundary(s);
    let detector = '';
    let secData = null;
    if (Format.isSECLayout(layout)) {
      const { info } = jcamp;
      detector = info.$DETECTOR ? info.$DETECTOR : '';
      const {
        D, MN, MP, MW,
      } = info;
      secData = {
        d: D, mn: MN, mp: MP, mw: MW,
      };
    }
    return Object.assign({}, base, cpo, bnd, { detector, secData });
  }).filter((r) => r != null);

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
  const thresRef = (jcamp.info && jcamp.info.$CSTHRESHOLD * 100) || 5;
  const base = jcamp.spectra[0];

  const features = jcamp.spectra.map((s) => {
    const cpo = buildPeakFeature(jcamp, layout, peakUp, s, +thresRef.toFixed(4));
    const bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter((r) => r != null);

  return features;
};

const extractTemperature = (jcamp) => {
  if ('$CSAUTOMETADATA' in jcamp.info) {
    const match = jcamp.info.$CSAUTOMETADATA.match(/TEMPERATURE=([\d.]+)/);
    if (match !== null) {
      const temperature = match[1];
      return temperature;
    }
  }
  return 'xxx';
};

const ExtractJcamp = (source) => {
  const jcamp = Jcampconverter.convert(
    source,
    {
      xy: true,
      keepRecordsRegExp: /(\$CSTHRESHOLD|\$CSSCANAUTOTARGET|\$CSSCANEDITTARGET|\$CSSCANCOUNT|\$CSSOLVENTNAME|\$CSSOLVENTVALUE|\$CSSOLVENTX|\$CSCATEGORY|\$CSITAREA|\$CSITFACTOR|\$OBSERVEDINTEGRALS|\$OBSERVEDMULTIPLETS|\$OBSERVEDMULTIPLETSPEAKS|\.SOLVENTNAME|\.OBSERVEFREQUENCY|\$CSSIMULATIONPEAKS|\$CSUPPERTHRESHOLD|\$CSLOWERTHRESHOLD|\$CSCYCLICVOLTAMMETRYDATA|UNITS|SYMBOL|CSAUTOMETADATA|\$DETECTOR|MN|MW|D|MP|MELTINGPOINT|TG|\$CSSCANRATE|\$CSSPECTRUMDIRECTION)/, // eslint-disable-line
    },
  );
  const layout = readLayout(jcamp);
  const peakUp = !Format.isIrLayout(layout);

  const spectra = (Format.isMsLayout(layout) || Format.isLCMsLayout(layout))
    ? extrSpectraMs(jcamp, layout)
    : extrSpectraNi(jcamp, layout);
  let features = {};
  if (Format.isMsLayout(layout) || Format.isLCMsLayout(layout)) {
    features = extrFeaturesMs(jcamp, layout, peakUp);
  } else if (Format.isXRDLayout(layout)) {
    features = extrFeaturesXrd(jcamp, layout, peakUp);
    const temperature = extractTemperature(jcamp);
    return {
      spectra, features, layout, temperature,
    };
  } else if (Format.isCyclicVoltaLayout(layout) || Format.isSECLayout(layout)
  || Format.isAIFLayout(layout) || Format.isCDSLayout(layout) || Format.isGCLayout(layout)) {
    features = extrFeaturesCylicVolta(jcamp, layout, peakUp);
  } else {
    features = extrFeaturesNi(jcamp, layout, peakUp, spectra);
    if (Format.isDSCLayout(layout)) {
      const { info } = jcamp;
      const {
        MELTINGPOINT, TG,
      } = info;
      const dscMetaData = {
        meltingPoint: MELTINGPOINT,
        tg: TG,
      };
      features = Object.assign({}, features, { dscMetaData });
    }
  }
  // const features = Format.isMsLayout(layout)
  //   ? extrFeaturesMs(jcamp, layout, peakUp)
  //   : ((Format.isXRDLayout(layout) || Format.isCyclicVoltaLayout(layout))
  //     ? extrFeaturesXrd(jcamp, layout, peakUp) : extrFeaturesNi(jcamp, layout, peakUp, spectra));

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

const Convert2DValue = (doubleTheta, lambda = 0.15406, isRadian = true) => {
  let theta = doubleTheta / 2;
  if (isRadian) {
    theta = (theta / 180) * Math.PI;
  }
  const sinTheta = Math.sin(theta);
  const dValue = lambda / (2 * sinTheta);
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

const GetCyclicVoltaPreviousShift = (cyclicVolta, curveIdx) => {
  if (!cyclicVolta) {
    return 0.0;
  }
  const { spectraList } = cyclicVolta;
  if (spectraList.length <= curveIdx) {
    return 0.0;
  }
  const { shift, hasRefPeak } = spectraList[curveIdx];
  const { prevValue } = shift;
  return hasRefPeak ? prevValue : -prevValue;
};

export {
  ExtractJcamp, Topic2Seed, Feature2Peak,
  ToThresEndPts, ToShiftPeaks, ToFrequency,
  Convert2Peak, Convert2Scan, Convert2Thres,
  GetComparisons, Convert2DValue,
  GetCyclicVoltaRatio, GetCyclicVoltaPeakSeparate,
  Feature2MaxMinPeak, convertTopic, Convert2MaxMinPeak,
  GetCyclicVoltaShiftOffset, GetCyclicVoltaPreviousShift,
  convertThresEndPts,
};
