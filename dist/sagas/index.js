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
const watchers = [..._saga_edit_peak.default, ..._saga_manager.default, ..._saga_ui.default, ..._saga_meta.default, ..._saga_multiplicity.default, ..._saga_multi_entities.default];
function* rootSaga() {
  // Each watcher gets its own spawn so an uncaught error in one (e.g. a
  // malformed action payload reaching a single reducer/saga) only kills
  // that watcher, instead of propagating up through `all` and cancelling
  // every other watcher in the app for the rest of the session.
  yield (0, _effects.all)(watchers.map(watcher => (0, _effects.spawn)(function* isolate() {
    yield watcher;
  })));
}