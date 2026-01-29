"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mpyIdTag = exports.itgIdTag = void 0;
const itgIdTag = d => `${Math.round(1000 * d.xL)}-${Math.round(1000 * d.xU)}`;
exports.itgIdTag = itgIdTag;
const mpyIdTag = d => `${Math.round(1000 * d.xExtent.xL)}-${Math.round(1000 * d.xExtent.xU)}`;
exports.mpyIdTag = mpyIdTag;