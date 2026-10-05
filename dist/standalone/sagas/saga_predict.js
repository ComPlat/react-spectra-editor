"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _app = require("../../app");
var _action_type = require("../constants/action_type");
var _fetcher_predict = _interopRequireDefault(require("../fetchers/fetcher_predict"));
var _helper = require("../utils/helper");
function* predictByServer(action) {
  const {
    payload
  } = action;
  const rsp = yield (0, _effects.call)(_fetcher_predict.default.predict, payload);
  if (rsp && rsp.outline.code) {
    yield (0, _effects.put)({
      type: _action_type.PREDICT.PREDICT_DONE,
      payload: rsp
    });
  } else {
    yield (0, _effects.put)({
      type: _action_type.PREDICT.PREDICT_FAIL,
      payload: rsp
    });
  }
}
function* predictToWriteByServer(action) {
  const {
    payload
  } = action;
  const {
    peaks,
    layout,
    shift,
    isAscend,
    decimal
  } = payload;
  const rsp = yield (0, _effects.call)(_fetcher_predict.default.predict, payload);
  if (rsp && rsp.outline.code) {
    yield (0, _effects.put)({
      type: _action_type.PREDICT.PREDICT_DONE,
      payload: rsp
    });
    const predictions = rsp.output.result[0].shifts;
    const body = _app.FN.formatPeaksByPrediction(peaks, layout, isAscend, decimal, predictions);
    const wrapper = _app.FN.peaksWrapper(layout, shift);
    const desc = (0, _helper.RmDollarSign)(wrapper.head) + body + wrapper.tail;
    yield (0, _effects.put)({
      type: _action_type.DESC.UPDATE,
      payload: desc
    });
  } else {
    yield (0, _effects.put)({
      type: _action_type.PREDICT.PREDICT_FAIL,
      payload: rsp
    });
  }
}
const predictSagas = [(0, _effects.takeEvery)(_action_type.PREDICT.PREDICT_INIT, predictByServer), (0, _effects.takeEvery)(_action_type.PREDICT.PREDICT_TO_WRITE_INIT, predictToWriteByServer)];
var _default = exports.default = predictSagas;