"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.predictToWriteInit = exports.predictInit = exports.addPredJsonInit = void 0;
var _action_type = require("../constants/action_type");
const predictInit = payload => ({
  type: _action_type.PREDICT.PREDICT_INIT,
  payload
});
exports.predictInit = predictInit;
const addPredJsonInit = payload => ({
  type: _action_type.PREDICT.ADD_PRED_JSON_INIT,
  payload
});
exports.addPredJsonInit = addPredJsonInit;
const predictToWriteInit = payload => ({
  type: _action_type.PREDICT.PREDICT_TO_WRITE_INIT,
  payload
});
exports.predictToWriteInit = predictToWriteInit;