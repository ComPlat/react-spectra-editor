'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcMpyManual = undefined;

var _multiplicity = require('./multiplicity');

var isTypeM = function isTypeM(mpyType) {
  return mpyType === 'm';
};
var isTypeBasic = function isTypeBasic(mpyType) {
  return _multiplicity.mpyBasicPatterns.slice(1).indexOf(mpyType) >= 0;
};

var outputTypeM = function outputTypeM(k) {
  return Object.assign({}, k, { mpyType: 'm', js: [] });
};

var outputTypeBasic = function outputTypeBasic(k, mpyType, ivs, freq) {
  var numIvs = ivs.length || 1;
  var js = [freq * ivs.reduce(function (sum, x) {
    return sum + x;
  }) / numIvs];
  return Object.assign({}, k, { mpyType: mpyType, js: js });
};

var outputTypeDD = function outputTypeDD(k, mpyType, ivs, freq) {
  if (ivs.length >= 2) {
    var js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, { mpyType: mpyType, js: js });
  }
  return Object.assign({}, k, { mpyType: mpyType, js: [] });
};

var outputTypeDT = function outputTypeDT(k, mpyType, ivs, freq) {
  if (ivs.length >= 4) {
    var js = [freq * ivs[0], freq * (ivs[1] + ivs[2] + ivs[3])];
    return Object.assign({}, k, { mpyType: mpyType, js: js });
  }
  return Object.assign({}, k, { mpyType: mpyType, js: [] });
};

var outputTypeTD = function outputTypeTD(k, mpyType, ivs, freq) {
  if (ivs.length >= 2) {
    var js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, { mpyType: mpyType, js: js });
  }
  return Object.assign({}, k, { mpyType: mpyType, js: [] });
};

var outputTypeDQ = function outputTypeDQ(k, mpyType, ivs, freq) {
  if (ivs.length >= 2) {
    var js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, { mpyType: mpyType, js: js });
  } // only consider J = ([1,2], [1,3]), not J = ([1,2], [1,5])
  return Object.assign({}, k, { mpyType: mpyType, js: [] });
};

var outputTypeQD = function outputTypeQD(k, mpyType, ivs, freq) {
  if (ivs.length >= 2) {
    var js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, { mpyType: mpyType, js: js });
  }
  return Object.assign({}, k, { mpyType: mpyType, js: [] });
};

var outputTypeDDD = function outputTypeDDD(k, mpyType, ivs, freq) {
  if (ivs.length >= 3) {
    var js = [freq * ivs[0], freq * (ivs[0] + ivs[1]), freq * (ivs[0] + ivs[1] + ivs[2] + ivs[3])];
    return Object.assign({}, k, { mpyType: mpyType, js: js });
  }
  return Object.assign({}, k, { mpyType: mpyType, js: [] });
};

var calcMpyManual = function calcMpyManual(k, mpyType, metaSt) {
  var observeFrequency = metaSt.peaks.observeFrequency;

  var freq = observeFrequency || 1.0;
  var ivs = (0, _multiplicity.getInterval)(k.peaks);
  if (ivs.length === 0) return Object.assign({}, k, { mpyType: mpyType, js: [] });
  if (isTypeM(mpyType)) return outputTypeM(k);
  if (isTypeBasic(mpyType)) return outputTypeBasic(k, mpyType, ivs, freq);
  if (mpyType === 'dd') return outputTypeDD(k, mpyType, ivs, freq);
  if (mpyType === 'dt') return outputTypeDT(k, mpyType, ivs, freq);
  if (mpyType === 'td') return outputTypeTD(k, mpyType, ivs, freq);
  if (mpyType === 'dq') return outputTypeDQ(k, mpyType, ivs, freq);
  if (mpyType === 'qd') return outputTypeQD(k, mpyType, ivs, freq);
  if (mpyType === 'ddd') return outputTypeDDD(k, mpyType, ivs, freq);
  return Object.assign({}, k, { mpyType: mpyType, js: [] });
};

exports.calcMpyManual = calcMpyManual;