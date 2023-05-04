"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
const getLayout = state => state.layout;
const getCurveSt = state => state.curve;
const getIntegrationSt = state => state.integration.present;
// const getShiftSt = (state) => state.shift;

function* resetShift(action) {
  // const curveSt = yield select(getCurveSt);
  const layout = yield (0, _effects.select)(getLayout);
  // const shiftSt = yield select(getShiftSt);

  const {
    payload
  } = action;
  // const { shift } = payload;
  // console.log(payload);
  // console.log(shiftSt);
  // const { curveIdx } = curveSt;
  // const { shifts } = shiftSt;
  // shifts[curveIdx] = shift;

  // const newPayload = Object.assign({}, shiftSt, { shifts, selectedIdx: curveIdx })

  yield (0, _effects.put)({
    type: _action_type.MANAGER.RESETSHIFT,
    payload: Object.assign(
    // eslint-disable-line
    {}, payload, {
      layout
    })
  });
}
function* resetInitNmr(action) {
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const integationSt = yield (0, _effects.select)(getIntegrationSt);
  const {
    curveIdx
  } = curveSt;
  const {
    integration,
    simulation
  } = action.payload;
  const {
    integrations
  } = integationSt;
  integrations[curveIdx] = integration;
  const payload = Object.assign({}, integationSt, {
    integrations,
    selectedIdx: curveIdx
  }); // eslint-disable-line

  if (integration) {
    yield (0, _effects.put)({
      type: _action_type.INTEGRATION.RESET_ALL_RDC,
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
function* resetInitCommonWithIntergation(action) {
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const integationSt = yield (0, _effects.select)(getIntegrationSt);
  const {
    curveIdx
  } = curveSt;
  const {
    integration
  } = action.payload;
  const {
    integrations
  } = integationSt;
  integrations[curveIdx] = integration;
  const payload = Object.assign({}, integationSt, {
    integrations,
    selectedIdx: curveIdx
  }); // eslint-disable-line

  if (integration) {
    yield (0, _effects.put)({
      type: _action_type.INTEGRATION.RESET_ALL_RDC,
      payload
    });
  }
}
const managerSagas = [(0, _effects.takeEvery)(_action_type.MANAGER.RESETALL, resetShift), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_NMR, resetInitNmr), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_COMMON_WITH_INTERGATION, resetInitCommonWithIntergation)];
var _default = managerSagas;
exports.default = _default;