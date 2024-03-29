"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
var _list_layout = require("../constants/list_layout");
/* eslint-disable no-plusplus */

const getLayoutSt = state => state.layout;
const getCurveSt = state => state.curve;
function getMaxMinPeak(curve) {
  return curve.maxminPeak;
}
function* setCyclicVoltametry(action) {
  // eslint-disable-line
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    listCurves
  } = curveSt;
  if (listCurves) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.RESETALL,
      payload: null
    });
    const numberOfCurves = listCurves.length;
    if (numberOfCurves <= 0) {
      return;
    }
    const firstCurve = listCurves[0];
    const {
      layout
    } = firstCurve;
    if (layout !== _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
      return;
    }
    for (let index = 0; index < listCurves.length; index++) {
      const curve = listCurves[index];
      const maxminPeak = getMaxMinPeak(curve);
      yield (0, _effects.put)({
        type: _action_type.CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS,
        payload: index
      });
      for (let pidx = 0; pidx < maxminPeak.max.length; pidx++) {
        const maxPeak = maxminPeak.max[pidx];
        yield (0, _effects.put)({
          type: _action_type.CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
          payload: {
            peak: maxPeak,
            index: pidx,
            jcampIdx: index
          }
        });
        const minPeak = maxminPeak.min[pidx];
        yield (0, _effects.put)({
          type: _action_type.CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
          payload: {
            peak: minPeak,
            index: pidx,
            jcampIdx: index
          }
        });
        const pecker = maxminPeak.pecker[pidx];
        yield (0, _effects.put)({
          type: _action_type.CYCLIC_VOLTA_METRY.ADD_PECKER,
          payload: {
            peak: pecker,
            index: pidx,
            jcampIdx: index
          }
        });
      }
      const {
        refIndex
      } = maxminPeak;
      if (refIndex > -1) {
        yield (0, _effects.put)({
          type: _action_type.CYCLIC_VOLTA_METRY.SELECT_REF_PEAK,
          payload: {
            index: refIndex,
            jcampIdx: index,
            checked: true
          }
        });
      }
    }
  }
}
function* setCyclicVoltametryRef(action) {
  // eslint-disable-line
  const layoutSt = yield (0, _effects.select)(getLayoutSt);
  if (layoutSt !== _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
    return;
  }
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    curveIdx
  } = curveSt;
  yield (0, _effects.put)({
    type: _action_type.CYCLIC_VOLTA_METRY.SET_REF,
    payload: {
      jcampIdx: curveIdx
    }
  });
}
const multiEntitiesSagas = [(0, _effects.takeEvery)(_action_type.CURVE.SET_ALL_CURVES, setCyclicVoltametry), (0, _effects.takeEvery)(_action_type.CYCLIC_VOLTA_METRY.SET_FACTOR, setCyclicVoltametryRef)];
var _default = exports.default = multiEntitiesSagas;