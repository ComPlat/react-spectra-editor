'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawDestroy = exports.drawDisplay = exports.drawLabel = exports.drawMain = undefined;

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var drawMain = function drawMain(klass, w, h) {
  d3.select(klass).append('svg').attr('class', 'd3Svg').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', '0 0 ' + w + ' ' + h);
};

var drawLabel = function drawLabel(klass, cLabel, xLabel, yLabel) {
  d3.select(klass).selectAll('.xLabel').text(xLabel);
  d3.select(klass).selectAll('.yLabel').text(yLabel);
  if (cLabel) {
    d3.select(klass).selectAll('.mark-text').text(cLabel);
  }
};

var drawDisplay = function drawDisplay(klass, isHidden) {
  if (isHidden) {
    d3.select(klass).selectAll('svg').style('width', 0);
  } else {
    d3.select(klass).selectAll('svg').style('width', '100%');
  }
};

var drawDestroy = function drawDestroy(klass) {
  return d3.select(klass + ' > *').remove();
};

exports.drawMain = drawMain;
exports.drawLabel = drawLabel;
exports.drawDisplay = drawDisplay;
exports.drawDestroy = drawDestroy;