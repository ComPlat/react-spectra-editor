"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
var _peakInterval = require("../third_party/peakInterval");
function* updateMetaPeaks(action) {
  const {
    payload
  } = action;
  const {
    intervalL,
    intervalR
  } = (0, _peakInterval.getPeakIntervals)(payload);
  const {
    observeFrequency,
    data
  } = payload.spectra[0];
  const deltaX = Math.abs(data[0].x[0] - data[0].x[1]);
  yield (0, _effects.put)({
    type: _action_type.META.UPDATE_PEAKS_RDC,
    payload: {
      peaks: {
        intervalL,
        intervalR,
        observeFrequency,
        deltaX
      }
    }
  });
}
function* updateMetaData(action) {
  yield (0, _effects.put)({
    type: _action_type.META.UPDATE_META_DATA_RDC,
    payload: {
      dscMetaData: action.payload
    }
  });
}
const metaSagas = [(0, _effects.takeEvery)(_action_type.META.UPDATE_PEAKS, updateMetaPeaks), (0, _effects.takeEvery)(_action_type.META.UPDATE_META_DATA, updateMetaData)];
var _default = exports.default = metaSagas;