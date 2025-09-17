/* eslint-disable no-plusplus */
import { put, takeEvery, select } from 'redux-saga/effects';

import {
  CURVE, CYCLIC_VOLTA_METRY, INTEGRATION, SIMULATION, MULTIPLICITY,
} from '../constants/action_type';

import { LIST_LAYOUT } from '../constants/list_layout';

const getLayoutSt = (state) => state.layout;
const getCurveSt = (state) => state.curve;
const getIntegrationSt = (state) => state.integration.present;
const getMultiplicitySt = (state) => state.multiplicity.present;

function getMaxMinPeak(curve) {
  return curve.maxminPeak;
}

function* setCyclicVoltametry(action) { // eslint-disable-line
  const curveSt = yield select(getCurveSt);
  const { listCurves } = curveSt;

  if (listCurves) {
    yield put(({
      type: CYCLIC_VOLTA_METRY.RESETALL,
      payload: null,
    }));

    const numberOfCurves = listCurves.length;
    if (numberOfCurves <= 0) {
      return;
    }

    const firstCurve = listCurves[0];
    const { layout } = firstCurve;
    if (layout !== LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
      return;
    }

    const cvSt = yield select((state) => state.cyclicvolta);
    const { feature } = firstCurve;
    if (feature) {
      const { weAreaValue, weAreaUnit, currentMode } = feature;
      if (typeof weAreaUnit === 'string' && weAreaUnit.length > 0) {
        const unit = weAreaUnit.replace('^2', '²');
        yield put(({ type: CYCLIC_VOLTA_METRY.SET_AREA_UNIT, payload: { unit } }));
      }
      else {
        yield put(({ type: CYCLIC_VOLTA_METRY.SET_AREA_UNIT, payload: { unit: 'cm²' } }));
      }
      if (weAreaValue !== undefined && weAreaValue !== null) {
        let numeric = null;
        if (typeof weAreaValue === 'string') {
          const parsed = parseFloat(weAreaValue);
          if (!Number.isNaN(parsed)) numeric = parsed;
        } else if (Number.isFinite(weAreaValue)) {
          numeric = weAreaValue;
        }
        if (Number.isFinite(numeric)) {
          yield put(({ type: CYCLIC_VOLTA_METRY.SET_AREA_VALUE, payload: { value: numeric } }));
        }
        else {
          yield put(({ type: CYCLIC_VOLTA_METRY.SET_AREA_VALUE, payload: { value: 1.0 } }));
        }
      }
      if (typeof currentMode === 'string' && currentMode.length > 0) {
        const wantDensity = currentMode.toUpperCase() === 'DENSITY';
        if (!!cvSt.useCurrentDensity !== wantDensity) {
          yield put(({ type: CYCLIC_VOLTA_METRY.TOGGLE_DENSITY, payload: null }));
        }
      }
    }

    for (let index = 0; index < listCurves.length; index++) {
      const curve = listCurves[index];
      const maxminPeak = getMaxMinPeak(curve);
      yield put(({
        type: CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS,
        payload: index,
      }));

      for (let pidx = 0; pidx < maxminPeak.max.length; pidx++) {
        const maxPeak = maxminPeak.max[pidx];
        yield put(({
          type: CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
          payload: { peak: maxPeak, index: pidx, jcampIdx: index },
        }));

        const minPeak = maxminPeak.min[pidx];
        yield put(({
          type: CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
          payload: { peak: minPeak, index: pidx, jcampIdx: index },
        }));

        const pecker = maxminPeak.pecker[pidx];
        yield put(({
          type: CYCLIC_VOLTA_METRY.ADD_PECKER,
          payload: { peak: pecker, index: pidx, jcampIdx: index },
        }));
      }
      const { refIndex } = maxminPeak;
      if (refIndex > -1) {
        yield put(({
          type: CYCLIC_VOLTA_METRY.SELECT_REF_PEAK,
          payload: { index: refIndex, jcampIdx: index, checked: true },
        }));
      }
    }
  }
}

function* setCyclicVoltametryRef(action) { // eslint-disable-line
  const layoutSt = yield select(getLayoutSt);
  if (layoutSt !== LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
    return;
  }

  const curveSt = yield select(getCurveSt);
  const { curveIdx } = curveSt;
  yield put(({
    type: CYCLIC_VOLTA_METRY.SET_REF,
    payload: { jcampIdx: curveIdx },
  }));
}

function* setInitIntegrations(action) { // eslint-disable-line
  const curveSt = yield select(getCurveSt);
  const { listCurves } = curveSt;
  if (listCurves) {
    for (let index = 0; index < listCurves.length; index++) {
      const integationSt = yield select(getIntegrationSt);
      const multiplicitySt = yield select(getMultiplicitySt);
      const curve = listCurves[index];
      const { integration, multiplicity, simulation } = curve;

      if (integration) {
        const { integrations } = integationSt;
        const newArrIntegration = [...integrations];
        if (index < newArrIntegration.length) {
          newArrIntegration[index] = integration;
        } else {
          newArrIntegration.push(integration);
        }
        const payload = Object.assign({}, integationSt, { integrations: newArrIntegration, selectedIdx: index }); // eslint-disable-line
        yield put({
          type: INTEGRATION.RESET_ALL_RDC,
          payload,
        });
      }

      if (multiplicity) {
        const { multiplicities } = multiplicitySt;
        const newArrMultiplicities = [...multiplicities];
        if (index < newArrMultiplicities.length) {
          newArrMultiplicities[index] = multiplicity;
        } else {
          newArrMultiplicities.push(multiplicity);
        }
        const payload = Object.assign({}, multiplicitySt, { multiplicities: newArrMultiplicities, selectedIdx: index }); // eslint-disable-line
        yield put({
          type: MULTIPLICITY.RESET_ALL_RDC,
          payload,
        });
      }

      if (simulation) {
        yield put({
          type: SIMULATION.RESET_ALL_RDC,
          payload: simulation,
        });
      }
    }
  }
}

const multiEntitiesSagas = [
  takeEvery(CURVE.SET_ALL_CURVES, setCyclicVoltametry),
  takeEvery(CURVE.SET_ALL_CURVES, setInitIntegrations),
  takeEvery(CYCLIC_VOLTA_METRY.SET_FACTOR, setCyclicVoltametryRef),
];

export default multiEntitiesSagas;
