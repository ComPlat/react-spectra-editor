'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAbsoluteArea = exports.calcArea = exports.getArea = undefined;

var _calc = require('./calc');

var getArea = function getArea(xL, xU, data) {
  var iL = data.length - 1,
      iU = 0;


  for (var i = 0; i < data.length; i += 1) {
    var pt = data[i];
    if (xL <= pt.x && pt.x <= xU) {
      if (iL > i) {
        iL = i;
      }
      if (i > iU) {
        iU = i;
      }
    }
  }
  return Math.abs(data[iU].k - data[iL].k);
};

var getAbsoluteArea = function getAbsoluteArea(xL, xU, data) {

  var ps = data.filter(function (d) {
    return d.x > xL && d.x < xU;
  });
  if (!ps[0]) return 0;

  var area = 0;
  var point1 = ps[0];
  var point2 = ps[ps.length - 1];
  var slope = (0, _calc.calcSlope)(point1.x, point1.y, point2.x, point2.y);
  var lastDY = point1.y;

  if (ps.length > 1) {
    for (var i = 1; i < ps.length; i += 1) {
      var pt = ps[i];
      var lastD = ps[i - 1];
      var y = slope * (pt.x - lastD.x) + lastDY;
      lastDY = y;
      var delta = Math.abs(pt.y - y);
      area += delta;
    }
  }

  return area;
};

var calcArea = function calcArea(d, refArea, refFactor) {
  var ignoreRef = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (ignoreRef) {
    return d.absoluteArea.toFixed(2);
  }
  return (d.area * refFactor / refArea).toFixed(2);
};

exports.getArea = getArea;
exports.calcArea = calcArea;
exports.getAbsoluteArea = getAbsoluteArea; // eslint-disable-line