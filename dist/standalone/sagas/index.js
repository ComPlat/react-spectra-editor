"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rootSaga;
var _effects = require("redux-saga/effects");
var _saga_file = _interopRequireDefault(require("./saga_file"));
var _saga_mol = _interopRequireDefault(require("./saga_mol"));
var _saga_predict = _interopRequireDefault(require("./saga_predict"));
var _saga_jcamp = _interopRequireDefault(require("./saga_jcamp"));
function* rootSaga() {
  yield (0, _effects.all)([..._saga_file.default, ..._saga_mol.default, ..._saga_predict.default, ..._saga_jcamp.default]);
}