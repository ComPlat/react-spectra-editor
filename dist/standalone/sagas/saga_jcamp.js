"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _base = _interopRequireDefault(require("base-64"));
var _effects = require("redux-saga/effects");
var _app = require("../../app");
var _action_type = require("../constants/action_type");
var _util_file = require("../utils/util_file");
var _fetcher_file = _interopRequireDefault(require("../fetchers/fetcher_file"));
function* addOthers(action) {
  const {
    payload
  } = action;
  const jcamp = payload.jcamps[0];
  const isValidJcampExt = (0, _util_file.VerifyJcampExt)(jcamp);
  const isValidSize = (0, _util_file.VerifySize)(jcamp);
  if (isValidJcampExt && isValidSize) {
    const rsp = yield (0, _effects.call)(_fetcher_file.default.convertFile, {
      file: jcamp
    });
    if (rsp && rsp.status) {
      const origData = _base.default.decode(rsp.jcamp);
      const jcampData = _app.FN.ExtractJcamp(origData);
      yield (0, _effects.put)({
        type: _action_type.JCAMP.ADD_OTHERS_RDC,
        payload: {
          jcamp: jcampData
        }
      });
    } else {
      yield (0, _effects.put)({
        type: _action_type.FILE.CONVERT_FAIL,
        payload: {
          error: rsp && rsp.error
        }
      });
    }
  } else {
    yield (0, _effects.put)({
      type: _action_type.FILE.CONVERT_FAIL,
      payload
    });
  }
}
const jcampSagas = [(0, _effects.takeEvery)(_action_type.JCAMP.ADD_OTHERS_INIT, addOthers)];
var _default = exports.default = jcampSagas;