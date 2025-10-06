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
const getIntegrationSt = state => state.integration.present;
const getMultiplicitySt = state => state.multiplicity.present;
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
    if (layout !== _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY && layout !== _list_layout.LIST_LAYOUT.LSV) {
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
  if (layoutSt !== _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY && layoutSt !== _list_layout.LIST_LAYOUT.LSV) {
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
function* setInitIntegrations(action) {
  // eslint-disable-line
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    listCurves
  } = curveSt;
  if (listCurves) {
    for (let index = 0; index < listCurves.length; index++) {
      const integationSt = yield (0, _effects.select)(getIntegrationSt);
      const multiplicitySt = yield (0, _effects.select)(getMultiplicitySt);
      const curve = listCurves[index];
      const {
        integration,
        multiplicity,
        simulation
      } = curve;
      if (integration) {
        const {
          integrations
        } = integationSt;
        const newArrIntegration = [...integrations];
        if (index < newArrIntegration.length) {
          newArrIntegration[index] = integration;
        } else {
          newArrIntegration.push(integration);
        }
        const payload = Object.assign({}, integationSt, {
          integrations: newArrIntegration,
          selectedIdx: index
        }); // eslint-disable-line
        yield (0, _effects.put)({
          type: _action_type.INTEGRATION.RESET_ALL_RDC,
          payload
        });
      }
      if (multiplicity) {
        const {
          multiplicities
        } = multiplicitySt;
        const newArrMultiplicities = [...multiplicities];
        if (index < newArrMultiplicities.length) {
          newArrMultiplicities[index] = multiplicity;
        } else {
          newArrMultiplicities.push(multiplicity);
        }
        const payload = Object.assign({}, multiplicitySt, {
          multiplicities: newArrMultiplicities,
          selectedIdx: index
        }); // eslint-disable-line
        yield (0, _effects.put)({
          type: _action_type.MULTIPLICITY.RESET_ALL_RDC,
          payload
        });
      }
      if (simulation) {
        yield (0, _effects.put)({
          type: _action_type.SIMULATION.RESET_ALL_RDC,
          payload: simulation
        });
      }
    }
  }
}
const multiEntitiesSagas = [(0, _effects.takeEvery)(_action_type.CURVE.SET_ALL_CURVES, setCyclicVoltametry), (0, _effects.takeEvery)(_action_type.CURVE.SET_ALL_CURVES, setInitIntegrations), (0, _effects.takeEvery)(_action_type.CYCLIC_VOLTA_METRY.SET_FACTOR, setCyclicVoltametryRef)];
var _default = exports.default = multiEntitiesSagas;