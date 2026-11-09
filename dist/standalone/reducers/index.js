"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _redux = require("redux");
var _reducer_file = _interopRequireDefault(require("./reducer_file"));
var _reducer_mol = _interopRequireDefault(require("./reducer_mol"));
var _reducer_notice = _interopRequireDefault(require("./reducer_notice"));
var _reducer_loading = _interopRequireDefault(require("./reducer_loading"));
var _reducer_predict = _interopRequireDefault(require("./reducer_predict"));
var _reducer_form = _interopRequireDefault(require("./reducer_form"));
var _reducer_desc = _interopRequireDefault(require("./reducer_desc"));
var _reducer_jcamp = _interopRequireDefault(require("./reducer_jcamp"));
const rootReducer = (0, _redux.combineReducers)({
  file: _reducer_file.default,
  mol: _reducer_mol.default,
  notice: _reducer_notice.default,
  loading: _reducer_loading.default,
  predict: _reducer_predict.default,
  form: _reducer_form.default,
  desc: _reducer_desc.default,
  jcamp: _reducer_jcamp.default
});
var _default = exports.default = rootReducer;