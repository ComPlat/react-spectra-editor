"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcMpyManual = void 0;
var _multiplicity = require("./multiplicity");
/* eslint-disable prefer-object-spread, default-param-last, no-mixed-operators */

const isTypeM = mpyType => mpyType === 'm';
const isTypeBasic = mpyType => _multiplicity.mpyBasicPatterns.slice(1).indexOf(mpyType) >= 0;
const outputTypeM = k => Object.assign({}, k, {
  mpyType: 'm',
  js: []
});
const outputTypeBasic = (k, mpyType, ivs, freq) => {
  const numIvs = ivs.length || 1;
  const js = [freq * ivs.reduce((sum, x) => sum + x) / numIvs];
  return Object.assign({}, k, {
    mpyType,
    js
  });
};
const outputTypeDD = (k, mpyType, ivs, freq) => {
  if (ivs.length >= 2) {
    const js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, {
      mpyType,
      js
    });
  }
  return Object.assign({}, k, {
    mpyType,
    js: []
  });
};
const outputTypeDT = (k, mpyType, ivs, freq) => {
  if (ivs.length >= 4) {
    const js = [freq * ivs[0], freq * (ivs[1] + ivs[2] + ivs[3])];
    return Object.assign({}, k, {
      mpyType,
      js
    });
  }
  return Object.assign({}, k, {
    mpyType,
    js: []
  });
};
const outputTypeTD = (k, mpyType, ivs, freq) => {
  if (ivs.length >= 2) {
    const js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, {
      mpyType,
      js
    });
  }
  return Object.assign({}, k, {
    mpyType,
    js: []
  });
};
const outputTypeDQ = (k, mpyType, ivs, freq) => {
  if (ivs.length >= 2) {
    const js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, {
      mpyType,
      js
    });
  } // only consider J = ([1,2], [1,3]), not J = ([1,2], [1,5])
  return Object.assign({}, k, {
    mpyType,
    js: []
  });
};
const outputTypeQD = (k, mpyType, ivs, freq) => {
  if (ivs.length >= 2) {
    const js = [freq * ivs[0], freq * (ivs[0] + ivs[1])];
    return Object.assign({}, k, {
      mpyType,
      js
    });
  }
  return Object.assign({}, k, {
    mpyType,
    js: []
  });
};
const outputTypeDDD = (k, mpyType, ivs, freq) => {
  if (ivs.length >= 3) {
    const js = [freq * ivs[0], freq * (ivs[0] + ivs[1]), freq * (ivs[0] + ivs[1] + ivs[2] + ivs[3])];
    return Object.assign({}, k, {
      mpyType,
      js
    });
  }
  return Object.assign({}, k, {
    mpyType,
    js: []
  });
};
const calcMpyManual = (k, mpyType, metaSt) => {
  const {
    observeFrequency
  } = metaSt.peaks;
  const freq = observeFrequency || 1.0;
  const ivs = (0, _multiplicity.getInterval)(k.peaks);
  if (ivs.length === 0) return Object.assign({}, k, {
    mpyType,
    js: []
  });
  if (isTypeM(mpyType)) return outputTypeM(k);
  if (isTypeBasic(mpyType)) return outputTypeBasic(k, mpyType, ivs, freq);
  if (mpyType === 'dd') return outputTypeDD(k, mpyType, ivs, freq);
  if (mpyType === 'dt') return outputTypeDT(k, mpyType, ivs, freq);
  if (mpyType === 'td') return outputTypeTD(k, mpyType, ivs, freq);
  if (mpyType === 'dq') return outputTypeDQ(k, mpyType, ivs, freq);
  if (mpyType === 'qd') return outputTypeQD(k, mpyType, ivs, freq);
  if (mpyType === 'ddd') return outputTypeDDD(k, mpyType, ivs, freq);
  return Object.assign({}, k, {
    mpyType,
    js: []
  });
};
exports.calcMpyManual = calcMpyManual;