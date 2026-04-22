"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readLcmsMzPageFromJcampInfo = void 0;
var _lcmsMsPage = require("./lcmsMsPage");
/* eslint-disable import/prefer-default-export */

const readLcmsMzPageFromJcampInfo = info => {
  if (!info || info.$CSLCMSMZPAGE == null || info.$CSLCMSMZPAGE === '') return null;
  const raw = info.$CSLCMSMZPAGE;
  const scalar = Array.isArray(raw) ? raw[0] : raw;
  if (scalar == null || scalar === '') return null;
  const parsed = typeof scalar === 'number' && Number.isFinite(scalar) ? scalar : (0, _lcmsMsPage.parsePageValue)(String(scalar).trim());
  return Number.isFinite(parsed) ? parsed : null;
};
exports.readLcmsMzPageFromJcampInfo = readLcmsMzPageFromJcampInfo;