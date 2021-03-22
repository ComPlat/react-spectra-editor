"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var itgIdTag = function itgIdTag(d) {
  return Math.round(1000 * d.xL) + "-" + Math.round(1000 * d.xU);
};

var mpyIdTag = function mpyIdTag(d) {
  return Math.round(1000 * d.xExtent.xL) + "-" + Math.round(1000 * d.xExtent.xU);
};

exports.itgIdTag = itgIdTag;
exports.mpyIdTag = mpyIdTag;