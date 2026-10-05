"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
var _util_file = require("../utils/util_file");
var _fetcher_mol = _interopRequireDefault(require("../fetchers/fetcher_mol"));
function* analysisMol(action) {
  const {
    payload
  } = action;
  const {
    mol
  } = payload;
  const isValidMolExt = (0, _util_file.VerifyMolExt)(mol);
  const isValidSize = (0, _util_file.VerifySize)(mol);
  if (isValidMolExt && isValidSize) {
    yield (0, _effects.put)({
      type: _action_type.MOL.ADD_DONE,
      payload
    });
  } else {
    yield (0, _effects.put)({
      type: _action_type.MOL.ADD_FAIL,
      payload
    });
  }
}
const getMolSrc = state => state.mol.src;
function* convertMol(action) {
  const {
    payload
  } = action;
  const mol = payload.mol || (yield (0, _effects.select)(getMolSrc));
  const rsp = yield (0, _effects.call)(_fetcher_mol.default.convertMol, {
    mol
  });
  if (rsp && rsp.status) {
    const {
      smi,
      mass,
      svg
    } = rsp;
    yield (0, _effects.put)({
      type: _action_type.MOL.CONVERT_DONE,
      payload: {
        mol,
        smi,
        mass,
        svg
      }
    });
  } else {
    yield (0, _effects.put)({
      type: _action_type.MOL.CONVERT_FAIL,
      payload
    });
  }
}
const molSagas = [(0, _effects.takeEvery)(_action_type.MOL.ADD_INIT, analysisMol), (0, _effects.takeEvery)(_action_type.MOL.ADD_DONE, convertMol)];
var _default = exports.default = molSagas;