"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rootSaga;
var _effects = require("redux-saga/effects");
var _saga_edit_peak = _interopRequireDefault(require("./saga_edit_peak"));
var _saga_manager = _interopRequireDefault(require("./saga_manager"));
var _saga_ui = _interopRequireDefault(require("./saga_ui"));
var _saga_meta = _interopRequireDefault(require("./saga_meta"));
var _saga_multiplicity = _interopRequireDefault(require("./saga_multiplicity"));
var _saga_multi_entities = _interopRequireDefault(require("./saga_multi_entities"));
function* rootSaga() {
  yield (0, _effects.all)([..._saga_edit_peak.default, ..._saga_manager.default, ..._saga_ui.default, ..._saga_meta.default, ..._saga_multiplicity.default, ..._saga_multi_entities.default]);
}