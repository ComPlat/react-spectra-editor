'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetComparisons = exports.Convert2Thres = exports.Convert2Scan = exports.Convert2Peak = exports.ToFrequency = exports.ToShiftPeaks = exports.ToThresEndPts = exports.Feature2Peak = exports.Topic2Seed = exports.ExtractJcamp = undefined;

var _jcampconverter = require('jcampconverter');

var _jcampconverter2 = _interopRequireDefault(_jcampconverter);

var _reselect = require('reselect');

var _shift = require('./shift');

var _cfg = require('./cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

var _list_layout = require('../constants/list_layout');

var _integration = require('./integration');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getTopic = function getTopic(_, props) {
  return props.topic;
};

var getFeature = function getFeature(_, props) {
  return props.feature;
};

var getLayout = function getLayout(state, _) {
  return state.layout;
}; // eslint-disable-line

var getShiftOffset = function getShiftOffset(state, _) {
  // eslint-disable-line
  var shift = state.shift;
  var ref = shift.ref,
      peak = shift.peak;

  return (0, _shift.FromManualToOffset)(ref, peak);
};

var calcXYK = function calcXYK(xs, ys, maxY, offset) {
  var sp = [];
  var k = 0;
  for (var i = 0; i < ys.length; i += 1) {
    // no-downsample
    var x = xs[i] - offset;
    var y = ys[i];
    var cy = y / maxY;
    if (cy > 0.0) {
      k += cy;
    }
    sp.push({ x: x, y: y, k: k });
  }
  return sp;
};

var calcXY = function calcXY(xs, ys, maxY, offset) {
  var sp = [];
  for (var i = 0; i < ys.length; i += 1) {
    // no-downsample
    var x = xs[i] - offset;
    var y = ys[i];
    sp.push({ x: x, y: y });
  }
  return sp;
};

var convertTopic = function convertTopic(topic, layout, feature, offset) {
  var maxY = feature.maxY;

  var xs = topic.x;
  var ys = topic.y;

  var isItgDisable = _cfg2.default.btnCmdIntg(layout);
  if (!isItgDisable) return calcXYK(xs, ys, maxY, offset);
  return calcXY(xs, ys, maxY, offset);
};

var Topic2Seed = (0, _reselect.createSelector)(getTopic, getLayout, getFeature, getShiftOffset, convertTopic);

var getOthers = function getOthers(_, props) {
  return props.comparisons;
};

var calcRescaleXY = function calcRescaleXY(xs, ys, minY, maxY, show) {
  var sp = [];
  if (xs.length < 1) return sp;
  var _ref = [Math.min.apply(Math, _toConsumableArray(ys)), Math.max.apply(Math, _toConsumableArray(ys))],
      lowerY = _ref[0],
      upperY = _ref[1];

  var faktor = (maxY - minY) / (upperY - lowerY);
  for (var i = 0; i < ys.length; i += 2) {
    // downsample
    var x = xs[i];
    var y = (ys[i] - lowerY) * faktor + minY;
    sp.push({ x: x, y: y });
  }
  return { data: sp, show: show };
};

var convertComparisons = function convertComparisons(layout, comparisons, feature) {
  var minY = feature.minY,
      maxY = feature.maxY;

  if (!comparisons || !(_format2.default.isIrLayout(layout) || _format2.default.isHplcUvVisLayout(layout) || _format2.default.isUvVisLayout(layout))) return [];
  return comparisons.map(function (c) {
    var spectra = c.spectra,
        show = c.show;

    var topic = spectra[0].data[0];
    var xs = topic.x;
    var ys = topic.y;
    return calcRescaleXY(xs, ys, minY, maxY, show);
  });
};

var GetComparisons = (0, _reselect.createSelector)(getLayout, getOthers, getFeature, convertComparisons);

var convertFrequency = function convertFrequency(layout, feature) {
  if (['1H', '13C', '19F', '31P', '15N', '29Si'].indexOf(layout) < 0) return false;
  var observeFrequency = feature.observeFrequency;

  var freq = Array.isArray(observeFrequency) ? observeFrequency[0] : observeFrequency;
  return parseFloat(freq) || false;
};

var ToFrequency = (0, _reselect.createSelector)(getLayout, getFeature, convertFrequency);

var getThreshold = function getThreshold(state) {
  return state.threshold ? state.threshold.value * 1.0 : false;
};

var Convert2Peak = function Convert2Peak(feature, threshold, offset) {
  var peak = [];
  if (!feature || !feature.data) return peak;
  var data = feature.data[0];
  var maxY = feature.maxY,
      peakUp = feature.peakUp,
      thresRef = feature.thresRef;

  var thresVal = threshold || thresRef;
  var yThres = thresVal * maxY / 100.0;
  var corrOffset = offset || 0.0;
  for (var i = 0; i < data.y.length; i += 1) {
    var y = data.y[i];
    var overThres = peakUp && Math.abs(y) >= yThres || !peakUp && Math.abs(y) <= yThres;
    if (overThres) {
      var x = data.x[i] - corrOffset;
      peak.push({ x: x, y: y });
    }
  }
  return peak;
};

var Feature2Peak = (0, _reselect.createSelector)(getFeature, getThreshold, getShiftOffset, Convert2Peak);

var convertThresEndPts = function convertThresEndPts(feature, threshold) {
  var maxY = feature.maxY,
      maxX = feature.maxX,
      minX = feature.minX,
      thresRef = feature.thresRef;


  var thresVal = threshold || thresRef || 0;
  if (!thresVal || !feature.data) return [];
  var yThres = thresVal * maxY / 100.0;
  var endPts = [{ x: minX - 200, y: yThres }, { x: maxX + 200, y: yThres }];
  return endPts;
};

var ToThresEndPts = (0, _reselect.createSelector)(getFeature, getThreshold, convertThresEndPts);

var getShiftPeak = function getShiftPeak(state) {
  return state.shift.peak;
};

var convertSfPeaks = function convertSfPeaks(peak, offset) {
  if (!peak || !peak.x) return [];
  return [{ x: peak.x - offset, y: peak.y }];
};

var ToShiftPeaks = (0, _reselect.createSelector)(getShiftPeak, getShiftOffset, convertSfPeaks);

// - - - - - - - - - - - - - - - - - - - - - -
// ExtractJcamp
// - - - - - - - - - - - - - - - - - - - - - -
var readLayout = function readLayout(jcamp) {
  var xType = jcamp.xType,
      spectra = jcamp.spectra;

  if (xType && _format2.default.isNmrLayout(xType)) return xType;
  var dataType = spectra[0].dataType;

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
  }
  return false;
};

var extrSpectraShare = function extrSpectraShare(spectra, layout) {
  return spectra.map(function (s) {
    return Object.assign({ layout: layout }, s);
  }).filter(function (r) {
    return r != null;
  });
};

var extrSpectraMs = function extrSpectraMs(jcamp, layout) {
  var scanCount = jcamp.info.$CSSCANCOUNT || 1;
  var spc = extrSpectraShare(jcamp.spectra.slice(0, scanCount), layout);
  return spc || [];
};

var extrSpectraNi = function extrSpectraNi(jcamp, layout) {
  var categorys = jcamp.info.$CSCATEGORY || ['SPECTRUM'];
  var targetIdx = categorys.indexOf('SPECTRUM');
  var spectrum = extrSpectraShare(jcamp.spectra, layout)[targetIdx];
  var extractedSpectrum = spectrum || jcamp.spectra[0];
  if (_format2.default.isHplcUvVisLayout(layout) || _format2.default.isUvVisLayout(layout)) {
    extractedSpectrum['yUnit'] = 'mAU';
  }
  return [extractedSpectrum];
  // return [spectrum] || [jcamp.spectra[0]];
};

var calcThresRef = function calcThresRef(s, peakUp) {
  var ys = s && s.data[0].y;
  if (!ys) return null;
  var ref = peakUp ? Math.min.apply(Math, _toConsumableArray(ys.map(function (a) {
    return Math.abs(a);
  }))) : Math.max.apply(Math, _toConsumableArray(ys));
  return peakUp ? Math.floor(ref * 100 * 100 / s.maxY) / 100 : Math.ceil(ref * 100 * 100 / s.maxY) / 100;
};

var extractShift = function extractShift(s, jcamp) {
  var shift = {
    selectX: false,
    solventName: false,
    solventValue: false
  };
  if (!s) return shift;
  if (s && s.sampleDescription) {
    var desc = s.sampleDescription;
    var info = desc.split(/;|=/);

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

var buildPeakFeature = function buildPeakFeature(jcamp, layout, peakUp, s, thresRef) {
  var xType = jcamp.xType,
      info = jcamp.info;

  var subTyp = xType ? ' - ' + xType : '';

  return Object.assign({
    typ: s.dataType + subTyp,
    peakUp: peakUp,
    thresRef: thresRef,
    scanCount: +info.$CSSCANCOUNT,
    scanAutoTarget: +info.$CSSCANAUTOTARGET,
    scanEditTarget: +info.$CSSCANEDITTARGET,
    shift: extractShift(s, jcamp),
    operation: {
      layout: layout,
      nucleus: xType || ''
    },
    observeFrequency: info['.OBSERVEFREQUENCY'],
    solventName: info['.SOLVENTNAME']
  }, s);
};

var calcIntgRefArea = function calcIntgRefArea(spectra, stack) {
  if (stack.length === 0) return 1;
  var data = spectra[0].data[0];

  var xs = data.x;
  var ys = data.y;
  var maxY = Math.max.apply(Math, _toConsumableArray(ys));
  var xyk = calcXYK(xs, ys, maxY, 0);
  var _stack$ = stack[0],
      xL = _stack$.xL,
      xU = _stack$.xU,
      area = _stack$.area;

  var rawArea = (0, _integration.getArea)(xL, xU, xyk);
  var raw2realRatio = rawArea / area;
  return { raw2realRatio: raw2realRatio };
};

var buildIntegFeature = function buildIntegFeature(jcamp, spectra) {
  var _jcamp$info = jcamp.info,
      $OBSERVEDINTEGRALS = _jcamp$info.$OBSERVEDINTEGRALS,
      $OBSERVEDMULTIPLETS = _jcamp$info.$OBSERVEDMULTIPLETS;

  var regx = /[^0-9.,-]/g;
  var stack = [];
  if ($OBSERVEDINTEGRALS) {
    var its = $OBSERVEDINTEGRALS.split('\n').slice(1);
    var itStack = its.map(function (t) {
      var ts = t.replace(regx, '').split(',');
      return {
        xL: parseFloat(ts[0]),
        xU: parseFloat(ts[1]),
        area: parseFloat(ts[2])
      };
    });
    stack = [].concat(_toConsumableArray(stack), _toConsumableArray(itStack));
  }
  if ($OBSERVEDMULTIPLETS) {
    var mps = $OBSERVEDMULTIPLETS.split('\n');
    var mpStack = mps.map(function (m) {
      var ms = m.replace(regx, '').split(',');
      return {
        xL: parseFloat(ms[1]),
        xU: parseFloat(ms[2]),
        area: parseFloat(ms[4])
      };
    });
    stack = [].concat(_toConsumableArray(stack), _toConsumableArray(mpStack));
  }

  var _calcIntgRefArea = calcIntgRefArea(spectra, stack),
      raw2realRatio = _calcIntgRefArea.raw2realRatio;

  var mStack = stack.map(function (st) {
    return Object.assign({}, st, { area: st.area * raw2realRatio });
  });

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

var buildSimFeature = function buildSimFeature(jcamp) {
  var $CSSIMULATIONPEAKS = jcamp.info.$CSSIMULATIONPEAKS;

  var nmrSimPeaks = $CSSIMULATIONPEAKS ? $CSSIMULATIONPEAKS.split('\n') : [];
  nmrSimPeaks = nmrSimPeaks.map(function (x) {
    return parseFloat(x).toFixed(2);
  });
  return {
    nmrSimPeaks: nmrSimPeaks
  };
};

var buildMpyFeature = function buildMpyFeature(jcamp) {
  var _jcamp$info2 = jcamp.info,
      $OBSERVEDMULTIPLETS = _jcamp$info2.$OBSERVEDMULTIPLETS,
      $OBSERVEDMULTIPLETSPEAKS = _jcamp$info2.$OBSERVEDMULTIPLETSPEAKS;

  var regx = /[^A-Za-z0-9.,-]/g;
  var regxNum = /[^0-9.]/g;
  var stack = [];
  if (!$OBSERVEDMULTIPLETSPEAKS) return { stack: [] };
  var allPeaks = $OBSERVEDMULTIPLETSPEAKS.split('\n').map(function (p) {
    return p.replace(regx, '').split(',');
  });

  if ($OBSERVEDMULTIPLETS) {
    var mp = $OBSERVEDMULTIPLETS.split('\n');
    var mpStack = mp.map(function (m) {
      var ms = m.replace(regx, '').split(',');
      var idx = ms[0];
      var ys = [];
      var peaks = allPeaks.map(function (p) {
        if (p[0] === idx) {
          ys = [].concat(_toConsumableArray(ys), [parseFloat(p[2])]);
          return { x: parseFloat(p[1]), y: parseFloat(p[2]) };
        }
        return null;
      }).filter(function (r) {
        return r != null;
      });
      var js = m.split(',');
      js = js[js.length - 1].split(' ').map(function (j) {
        return parseFloat(j.replace(regxNum, ''));
      }).filter(Boolean);

      return {
        js: js,
        mpyType: ms[6],
        xExtent: {
          xL: parseFloat(ms[1]),
          xU: parseFloat(ms[2])
        },
        yExtent: {
          yL: Math.min.apply(Math, _toConsumableArray(ys)),
          yU: Math.max.apply(Math, _toConsumableArray(ys))
        },
        peaks: peaks
      };
    });
    stack = [].concat(_toConsumableArray(stack), _toConsumableArray(mpStack));
  }

  return {
    stack: stack,
    shift: 0,
    smExtext: false
  };
};

var isPeakTable = function isPeakTable(s) {
  return s.dataType && (s.dataType.includes('PEAKTABLE') || s.dataType.includes('PEAK ASSIGNMENTS'));
};

var extrFeaturesNi = function extrFeaturesNi(jcamp, layout, peakUp, spectra) {
  var nfs = {};
  var category = jcamp.info.$CSCATEGORY;
  if (category) {
    var idxEditPeak = category.indexOf('EDIT_PEAK');
    if (idxEditPeak >= 0) {
      var sEP = jcamp.spectra[idxEditPeak];
      var thresRef = calcThresRef(sEP, peakUp);
      nfs.editPeak = buildPeakFeature(jcamp, layout, peakUp, sEP, thresRef);
    }
    var idxAutoPeak = category.indexOf('AUTO_PEAK');
    if (idxAutoPeak >= 0) {
      var sAP = jcamp.spectra[idxAutoPeak];
      var _thresRef = calcThresRef(sAP, peakUp);
      nfs.autoPeak = buildPeakFeature(jcamp, layout, peakUp, sAP, _thresRef);
    }
    nfs.integration = buildIntegFeature(jcamp, spectra);
    nfs.multiplicity = buildMpyFeature(jcamp);
    nfs.simulation = buildSimFeature(jcamp);
    return nfs;
  }
  // workaround for legacy design
  var features = jcamp.spectra.map(function (s) {
    var thresRef = calcThresRef(s, peakUp);
    return isPeakTable(s) ? buildPeakFeature(jcamp, layout, peakUp, s, thresRef) : null;
  }).filter(function (r) {
    return r != null;
  });

  return { editPeak: features[0], autoPeak: features[1] };
};

var extrFeaturesXrd = function extrFeaturesXrd(jcamp, layout, peakUp) {
  var base = jcamp.spectra[0];

  var features = jcamp.spectra.map(function (s) {
    var cpo = buildPeakFeature(jcamp, layout, peakUp, s, 100);
    var bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter(function (r) {
    return r != null;
  });

  return features;
};

var getBoundary = function getBoundary(s) {
  var _s$data$ = s.data[0],
      x = _s$data$.x,
      y = _s$data$.y;

  var maxX = Math.max.apply(Math, _toConsumableArray(x));
  var minX = Math.min.apply(Math, _toConsumableArray(x));
  var maxY = Math.max.apply(Math, _toConsumableArray(y));
  var minY = Math.min.apply(Math, _toConsumableArray(y));
  return {
    maxX: maxX, minX: minX, maxY: maxY, minY: minY
  };
};

var extrFeaturesMs = function extrFeaturesMs(jcamp, layout, peakUp) {
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
  var thresRef = jcamp.info && jcamp.info.$CSTHRESHOLD * 100 || 5;
  var base = jcamp.spectra[0];

  var features = jcamp.spectra.map(function (s) {
    var cpo = buildPeakFeature(jcamp, layout, peakUp, s, +thresRef.toFixed(4));
    var bnd = getBoundary(s);
    return Object.assign({}, base, cpo, bnd);
  }).filter(function (r) {
    return r != null;
  });

  return features;
};

var ExtractJcamp = function ExtractJcamp(source) {
  var jcamp = _jcampconverter2.default.convert(source, {
    xy: true,
    keepRecordsRegExp: /(\$CSTHRESHOLD|\$CSSCANAUTOTARGET|\$CSSCANEDITTARGET|\$CSSCANCOUNT|\$CSSOLVENTNAME|\$CSSOLVENTVALUE|\$CSSOLVENTX|\$CSCATEGORY|\$CSITAREA|\$CSITFACTOR|\$OBSERVEDINTEGRALS|\$OBSERVEDMULTIPLETS|\$OBSERVEDMULTIPLETSPEAKS|\.SOLVENTNAME|\.OBSERVEFREQUENCY|\$CSSIMULATIONPEAKS)/ // eslint-disable-line
  });
  var layout = readLayout(jcamp);
  var peakUp = !_format2.default.isIrLayout(layout);

  var spectra = _format2.default.isMsLayout(layout) ? extrSpectraMs(jcamp, layout) : extrSpectraNi(jcamp, layout);
  // const features = Format.isMsLayout(layout)
  //   ? extrFeaturesMs(jcamp, layout, peakUp)
  //   : extrFeaturesNi(jcamp, layout, peakUp, spectra);
  var features = _format2.default.isMsLayout(layout) ? extrFeaturesMs(jcamp, layout, peakUp) : _format2.default.isXRDLayout(layout) ? extrFeaturesXrd(jcamp, layout, peakUp) : extrFeaturesNi(jcamp, layout, peakUp, spectra);

  return { spectra: spectra, features: features, layout: layout };
};

var Convert2Scan = function Convert2Scan(feature, scanSt) {
  var scanAutoTarget = feature.scanAutoTarget,
      scanEditTarget = feature.scanEditTarget;
  var target = scanSt.target,
      isAuto = scanSt.isAuto;

  var hasEdit = !!scanEditTarget;
  var defaultIdx = isAuto || !hasEdit ? scanAutoTarget : scanEditTarget;
  return target || defaultIdx;
};

var Convert2Thres = function Convert2Thres(feature, thresSt) {
  var value = thresSt.value || feature.thresRef;
  return value;
};

exports.ExtractJcamp = ExtractJcamp;
exports.Topic2Seed = Topic2Seed;
exports.Feature2Peak = Feature2Peak;
exports.ToThresEndPts = ToThresEndPts;
exports.ToShiftPeaks = ToShiftPeaks;
exports.ToFrequency = ToFrequency;
exports.Convert2Peak = Convert2Peak;
exports.Convert2Scan = Convert2Scan;
exports.Convert2Thres = Convert2Thres;
exports.GetComparisons = GetComparisons;