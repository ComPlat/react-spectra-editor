"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var calcArea = function calcArea(d, refArea, refFactor) {
  return (d.area * refFactor / refArea).toFixed(2);
};

exports.getArea = getArea;
exports.calcArea = calcArea; // eslint-disable-line