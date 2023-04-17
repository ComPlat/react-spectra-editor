'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _spectraOps;

var _converter = require('./converter');

var _list_layout = require('../constants/list_layout');

var _multiplicity_calc = require('./multiplicity_calc');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var spectraDigit = function spectraDigit(layout) {
  switch (layout) {
    case _list_layout.LIST_LAYOUT.IR:
    case _list_layout.LIST_LAYOUT.RAMAN:
    case _list_layout.LIST_LAYOUT.UVVIS:
    case _list_layout.LIST_LAYOUT.HPLC_UVVIS:
    case _list_layout.LIST_LAYOUT.TGA:
    case _list_layout.LIST_LAYOUT.XRD:
    case _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY:
    case _list_layout.LIST_LAYOUT.CDS:
    case _list_layout.LIST_LAYOUT.MS:
      return 0;
    case _list_layout.LIST_LAYOUT.C13:
      return 1;
    case _list_layout.LIST_LAYOUT.H1:
    case _list_layout.LIST_LAYOUT.F19:
    case _list_layout.LIST_LAYOUT.P31:
    case _list_layout.LIST_LAYOUT.N15:
    case _list_layout.LIST_LAYOUT.Si29:
    case _list_layout.LIST_LAYOUT.PLAIN:
    default:
      return 2;
  }
};

var fixDigit = function fixDigit(input, precision) {
  var output = input || 0.0;
  return output.toFixed(precision);
};

var buildData = function buildData(entity) {
  if (!entity) return { isExist: false };
  var sp = entity && entity.spectrum;
  var xLabel = sp ? 'X (' + sp.xUnit + ')' : '';
  var yLabel = sp ? 'Y (' + sp.yUnit + ')' : '';
  return {
    entity: entity, xLabel: xLabel, yLabel: yLabel, isExist: true
  };
};

var toPeakStr = function toPeakStr(peaks) {
  var arr = peaks.map(function (p) {
    return p.x + ',' + p.y;
  });
  var str = arr.join('#');
  return str;
};

var spectraOps = (_spectraOps = {}, _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.PLAIN, { head: '', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.H1, { head: '1H', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.C13, { head: '13C', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.F19, { head: '19F', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.P31, { head: '31P', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.N15, { head: '15N', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.Si29, { head: '29Si', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.IR, { head: 'IR', tail: ' cm-1' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.RAMAN, { head: 'RAMAN', tail: ' cm-1' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.UVVIS, { head: 'UV-VIS (absorption, solvent), λmax', tail: ' nm' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.HPLC_UVVIS, { head: 'HPLC UV/VIS (transmittance)', tail: '' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.TGA, { head: 'THERMOGRAVIMETRIC ANALYSIS', tail: ' SECONDS' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.MS, { head: 'MASS', tail: ' m/z' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.XRD, { head: 'X-RAY DIFFRACTION', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY, { head: 'CYCLIC VOLTAMMETRY', tail: '.' }), _defineProperty(_spectraOps, _list_layout.LIST_LAYOUT.CDS, { head: 'CIRCULAR DICHROISM SPECTROSCOPY', tail: '.' }), _spectraOps);

var rmRef = function rmRef(peaks, shift) {
  var refValue = shift.ref.value || shift.peak.x;
  return peaks.map(function (p) {
    return (0, _converter.IsSame)(p.x, refValue) ? null : p;
  }).filter(function (r) {
    return r != null;
  });
};

var formatedMS = function formatedMS(peaks, maxY) {
  var decimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var isAscend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var ascendFunc = function ascendFunc(a, b) {
    return parseFloat(a) - parseFloat(b);
  };
  var descendFunc = function descendFunc(a, b) {
    return parseFloat(b) - parseFloat(a);
  };
  var sortFunc = isAscend ? ascendFunc : descendFunc;
  var ordered = {};

  peaks.forEach(function (p) {
    var x = fixDigit(p.x, decimal);
    var better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, _defineProperty({}, x, p.y));
    }
  });

  ordered = Object.keys(ordered).sort(sortFunc).map(function (k) {
    return { x: k, y: ordered[k] };
  });

  return ordered.map(function (o) {
    return o.x + ' (' + parseInt(100 * o.y / maxY, 10) + ')';
  }).join(', ');
};

var emLevel = function emLevel(boundary, val, lowerIsStronger) {
  var maxY = boundary.maxY,
      minY = boundary.minY;

  var ratio = lowerIsStronger ? 100 * (val - minY) / (maxY - minY) : 100 * (maxY - val) / (maxY - minY);
  if (ratio > 85) return 'vw';
  if (ratio > 60) return 'w';
  if (ratio > 45) return 'm';
  if (ratio > 30) return 's';
  return 'vs';
};

var formatedEm = function formatedEm(peaks, maxY) {
  var decimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var isAscend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var isIntensity = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var boundary = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var lowerIsStronger = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

  var ascendFunc = function ascendFunc(a, b) {
    return parseFloat(a) - parseFloat(b);
  };
  var descendFunc = function descendFunc(a, b) {
    return parseFloat(b) - parseFloat(a);
  };
  var sortFunc = isAscend ? ascendFunc : descendFunc;
  var ordered = {};

  peaks.forEach(function (p) {
    var x = fixDigit(p.x, decimal);
    var better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, _defineProperty({}, x, p.y));
    }
  });

  ordered = Object.keys(ordered).sort(sortFunc).map(function (k) {
    return { x: k, y: ordered[k] };
  });

  if (isIntensity) {
    return ordered.map(function (o) {
      return o.x + ' (' + emLevel(boundary, o.y, lowerIsStronger) + ')';
    }).join(', ');
  }
  return ordered.map(function (o) {
    return '' + o.x;
  }).join(', ');
};

var formatedUvVis = function formatedUvVis(peaks, maxY) {
  var decimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var isAscend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var isIntensity = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var boundary = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var lowerIsStronger = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

  var ascendFunc = function ascendFunc(a, b) {
    return parseFloat(a) - parseFloat(b);
  };
  var descendFunc = function descendFunc(a, b) {
    return parseFloat(b) - parseFloat(a);
  };
  var sortFunc = isAscend ? ascendFunc : descendFunc;
  var ordered = {};

  peaks.forEach(function (p) {
    var x = fixDigit(p.x, decimal);
    var better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, _defineProperty({}, x, p.y));
    }
  });

  ordered = Object.keys(ordered).sort(sortFunc).map(function (k) {
    return { x: k, y: ordered[k] };
  });

  // return ordered.map(o => `${o.x} (${o.y.toFixed(2)})`)
  //   .join(', ');
  return ordered.map(function (o) {
    return '' + o.x;
  }).join(', ');
};

var formatedHplcUvVis = function formatedHplcUvVis(peaks) {
  var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var integration = arguments[2];


  var stack = [];
  if (integration) {
    stack = integration.stack;
  }

  var ordered = {};

  peaks.forEach(function (p) {
    var x = fixDigit(p.x, decimal);
    var better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, _defineProperty({}, x, p.y));
    }
  });

  ordered = Object.keys(ordered).map(function (k) {
    return { x: k, y: ordered[k] };
  });

  var arrResult = [];
  ordered.forEach(function (o) {
    var pStr = o.x + ' (' + o.y.toFixed(2) + ')';
    if (stack) {
      stack.forEach(function (s) {
        if (s.xL <= o.x && s.xU >= o.x) {
          pStr = o.x + ' (' + o.y.toFixed(2) + ', AUC=' + s.absoluteArea + ')';
        }
      });
    }
    arrResult.push(pStr);
  });

  return arrResult.join(', ');
};

var rmShiftFromPeaks = function rmShiftFromPeaks(peaks, shift) {
  var peaksXY = (0, _converter.ToXY)(peaks);
  // const digit = spectraDigit(layout);
  var rmShiftX = shift.ref.value || shift.peak.x;
  var result = peaksXY.map(function (p) {
    var srcX = parseFloat(p[0]);
    var x = (0, _converter.IsSame)(srcX, rmShiftX) ? null : srcX;
    if (!x) return null;
    var y = parseFloat(p[1]);
    return { x: x, y: y };
  }).filter(function (r) {
    return r != null;
  });
  return result;
};

var peaksBody = function peaksBody(_ref) {
  var peaks = _ref.peaks,
      layout = _ref.layout,
      decimal = _ref.decimal,
      shift = _ref.shift,
      isAscend = _ref.isAscend,
      _ref$isIntensity = _ref.isIntensity,
      isIntensity = _ref$isIntensity === undefined ? false : _ref$isIntensity,
      _ref$boundary = _ref.boundary,
      boundary = _ref$boundary === undefined ? {} : _ref$boundary,
      integration = _ref.integration;

  var result = rmShiftFromPeaks(peaks, shift);

  var ascendFunc = function ascendFunc(a, b) {
    return parseFloat(a.x) - parseFloat(b.x);
  };
  var descendFunc = function descendFunc(a, b) {
    return parseFloat(b.x) - parseFloat(a.x);
  };
  var sortFunc = isAscend ? ascendFunc : descendFunc;
  var ordered = result.sort(sortFunc);
  var maxY = Math.max.apply(Math, _toConsumableArray(ordered.map(function (o) {
    return o.y;
  })));

  if (layout === _list_layout.LIST_LAYOUT.MS) {
    return formatedMS(ordered, maxY, decimal, isAscend);
  }
  if (layout === _list_layout.LIST_LAYOUT.IR) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, true);
  }
  if (layout === _list_layout.LIST_LAYOUT.RAMAN) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.UVVIS) {
    return formatedUvVis(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.HPLC_UVVIS) {
    return formatedHplcUvVis(ordered, decimal, integration);
  }
  if (layout === _list_layout.LIST_LAYOUT.TGA) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.XRD) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.CDS) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  return ordered.map(function (o) {
    return fixDigit(o.x, decimal);
  }).join(', ');
};

var peaksWrapper = function peaksWrapper(layout, shift) {
  var solvTxt = '';
  if (shift.ref.label) {
    solvTxt = ' (' + shift.ref.label + ')';
  }

  if (layout === _list_layout.LIST_LAYOUT.PLAIN) {
    return { head: '', tail: '' };
  }

  var ops = spectraOps[layout];
  return { head: '' + ops.head + solvTxt + ' = ', tail: ops.tail };
};

var isNmrLayout = function isNmrLayout(layoutSt) {
  return [_list_layout.LIST_LAYOUT.H1, _list_layout.LIST_LAYOUT.C13, _list_layout.LIST_LAYOUT.F19, _list_layout.LIST_LAYOUT.P31, _list_layout.LIST_LAYOUT.N15, _list_layout.LIST_LAYOUT.Si29].indexOf(layoutSt) >= 0;
};
var is29SiLayout = function is29SiLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.Si29 === layoutSt;
};
var is15NLayout = function is15NLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.N15 === layoutSt;
};
var is31PLayout = function is31PLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.P31 === layoutSt;
};
var is19FLayout = function is19FLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.F19 === layoutSt;
};
var is13CLayout = function is13CLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.C13 === layoutSt;
};
var is1HLayout = function is1HLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.H1 === layoutSt;
};
var isMsLayout = function isMsLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.MS === layoutSt;
};
var isIrLayout = function isIrLayout(layoutSt) {
  return [_list_layout.LIST_LAYOUT.IR, 'INFRARED'].indexOf(layoutSt) >= 0;
};
var isRamanLayout = function isRamanLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.RAMAN === layoutSt;
};
var isUvVisLayout = function isUvVisLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.UVVIS === layoutSt;
};
var isHplcUvVisLayout = function isHplcUvVisLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.HPLC_UVVIS === layoutSt;
};
var isTGALayout = function isTGALayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.TGA === layoutSt;
};
var isXRDLayout = function isXRDLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.XRD === layoutSt;
};
var isCyclicVoltaLayout = function isCyclicVoltaLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY === layoutSt;
};
var isCDSLayout = function isCDSLayout(layoutSt) {
  return _list_layout.LIST_LAYOUT.CDS === layoutSt;
};
var isEmWaveLayout = function isEmWaveLayout(layoutSt) {
  return [_list_layout.LIST_LAYOUT.IR, _list_layout.LIST_LAYOUT.RAMAN, _list_layout.LIST_LAYOUT.UVVIS, _list_layout.LIST_LAYOUT.HPLC_UVVIS].indexOf(layoutSt) >= 0;
};

var getNmrTyp = function getNmrTyp(layout) {
  switch (layout) {
    case _list_layout.LIST_LAYOUT.H1:
      return 'H';
    case _list_layout.LIST_LAYOUT.C13:
      return 'C';
    case _list_layout.LIST_LAYOUT.F19:
      return 'F';
    case _list_layout.LIST_LAYOUT.P31:
      return 'P';
    case _list_layout.LIST_LAYOUT.N15:
      return 'N';
    case _list_layout.LIST_LAYOUT.Si29:
      return 'Si';
    default:
      return '';
  }
};

var formatPeaksByPrediction = function formatPeaksByPrediction(peaks, layout, isAscend, decimal) {
  var predictions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  var pDict = {};
  peaks.forEach(function (p) {
    pDict[p.x.toFixed(decimal)] = 0;
  });

  predictions.forEach(function (p) {
    var key = p.real.toFixed(decimal);
    if (typeof pDict[key] === 'number') {
      pDict[key] += 1;
    }
  });

  var typ = getNmrTyp(layout);

  var ascendFunc = function ascendFunc(a, b) {
    return parseFloat(a.k) - parseFloat(b.k);
  };
  var descendFunc = function descendFunc(a, b) {
    return parseFloat(b.k) - parseFloat(a.k);
  };
  var sortFunc = isAscend ? ascendFunc : descendFunc;
  var pArr = Object.keys(pDict).map(function (k) {
    if (pDict[k] === 1) return { k: k, v: k };
    return { k: k, v: k + ' (' + pDict[k] + typ + ')' };
  }).sort(sortFunc);

  var body = pArr.map(function (p) {
    return p.v;
  }).join(', ');
  return body;
};

var compareColors = function compareColors(idx) {
  return ['#ABB2B9', '#EDBB99', '#ABEBC6', '#D2B4DE', '#F9E79F'][idx % 5];
};

var mutiEntitiesColors = function mutiEntitiesColors(idx) {
  return ['#fa8231', '#f7b731', '#0fb9b1', '#2d98da', '#3867d6', '#8854d0', '#4b6584'][idx % 7];
};

var Format = {
  toPeakStr: toPeakStr,
  buildData: buildData,
  spectraDigit: spectraDigit,
  spectraOps: spectraOps,
  peaksBody: peaksBody,
  peaksWrapper: peaksWrapper,
  rmRef: rmRef,
  rmShiftFromPeaks: rmShiftFromPeaks,
  isNmrLayout: isNmrLayout,
  is13CLayout: is13CLayout,
  is1HLayout: is1HLayout,
  is19FLayout: is19FLayout,
  is31PLayout: is31PLayout,
  is15NLayout: is15NLayout,
  is29SiLayout: is29SiLayout,
  isMsLayout: isMsLayout,
  isIrLayout: isIrLayout,
  isRamanLayout: isRamanLayout,
  isUvVisLayout: isUvVisLayout,
  isHplcUvVisLayout: isHplcUvVisLayout,
  isTGALayout: isTGALayout,
  isXRDLayout: isXRDLayout,
  isCyclicVoltaLayout: isCyclicVoltaLayout,
  isCDSLayout: isCDSLayout,
  isEmWaveLayout: isEmWaveLayout,
  fixDigit: fixDigit,
  formatPeaksByPrediction: formatPeaksByPrediction,
  formatedMS: formatedMS,
  formatedEm: formatedEm,
  calcMpyCenter: _multiplicity_calc.calcMpyCenter,
  compareColors: compareColors,
  mutiEntitiesColors: mutiEntitiesColors
};

exports.default = Format;