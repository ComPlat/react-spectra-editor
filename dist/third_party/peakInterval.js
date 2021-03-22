'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPeakIntervals = undefined;

var _mlSavitzkyGolayGeneralized = require('ml-savitzky-golay-generalized');

var _mlSavitzkyGolayGeneralized2 = _interopRequireDefault(_mlSavitzkyGolayGeneralized);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
  sgOptions: {
    windowSize: 9,
    polynomial: 3
  },
  minMaxRatio: 0.00025,
  broadRatio: 0.0,
  maxCriteria: true,
  smoothY: true,
  realTopDetection: false,
  heightFactor: 0,
  boundaries: false,
  derivativeThreshold: -1
}; // https://github.com/mljs/global-spectral-deconvolution/blob/master/src/gsd.js

var getPeakIntervals = function getPeakIntervals(entity) {
  var data = entity.spectra[0].data[0];

  var X = data.x;
  var dX = X[1] - X[0];
  var Y = (0, _mlSavitzkyGolayGeneralized2.default)(data.y, data.x, {
    windowSize: options.sgOptions.windowSize,
    polynomial: options.sgOptions.polynomial,
    derivative: 0
  });
  var dY = (0, _mlSavitzkyGolayGeneralized2.default)(data.y, data.x, {
    windowSize: options.sgOptions.windowSize,
    polynomial: options.sgOptions.polynomial,
    derivative: 1
  });
  var ddY = (0, _mlSavitzkyGolayGeneralized2.default)(data.y, data.x, {
    windowSize: options.sgOptions.windowSize,
    polynomial: options.sgOptions.polynomial,
    derivative: 2
  });
  var maxDdy = 0;
  var maxY = 0;
  for (var i = 0; i < Y.length; i++) {
    if (Math.abs(ddY[i]) > maxDdy) {
      maxDdy = Math.abs(ddY[i]);
    }
    if (Math.abs(Y[i]) > maxY) {
      maxY = Math.abs(Y[i]);
    }
  }
  var lastMax = null;
  var lastMin = null;
  var minddY = new Array(Y.length - 2);
  var intervalL = new Array(Y.length);
  var intervalR = new Array(Y.length);
  var broadMask = new Array(Y.length - 2);
  var minddYLen = 0;
  var intervalLLen = 0;
  var intervalRLen = 0;
  var broadMaskLen = 0;

  for (var _i = 1; _i < Y.length - 1; ++_i) {
    // filter based on derivativeThreshold
    if (Math.abs(dY[_i]) > options.derivativeThreshold) {
      // Minimum in first derivative
      if (dY[_i] < dY[_i - 1] && dY[_i] <= dY[_i + 1] || dY[_i] <= dY[_i - 1] && dY[_i] < dY[_i + 1]) {
        lastMin = {
          x: X[_i],
          index: _i
        };
        if (dX > 0 && lastMax !== null) {
          intervalL[intervalLLen++] = lastMax;
          intervalR[intervalRLen++] = lastMin;
        }
      }

      // Maximum in first derivative
      if (dY[_i] >= dY[_i - 1] && dY[_i] > dY[_i + 1] || dY[_i] > dY[_i - 1] && dY[_i] >= dY[_i + 1]) {
        lastMax = {
          x: X[_i],
          index: _i
        };
        if (dX < 0 && lastMin !== null) {
          intervalL[intervalLLen++] = lastMax;
          intervalR[intervalRLen++] = lastMin;
        }
      }
    }
    // Minimum in second derivative
    if (ddY[_i] < ddY[_i - 1] && ddY[_i] < ddY[_i + 1]) {
      // TODO should we change this to have 3 arrays ? Huge overhead creating arrays
      minddY[minddYLen++] = _i; // ( [X[i], Y[i], i] );
      broadMask[broadMaskLen++] = Math.abs(ddY[_i]) <= options.broadRatio * maxDdy;
    }
  }
  return { intervalL: intervalL, intervalR: intervalR };
};

exports.getPeakIntervals = getPeakIntervals;