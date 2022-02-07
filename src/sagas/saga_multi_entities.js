import { put, takeEvery, select } from 'redux-saga/effects';

import { CURVE, CYCLIC_VOLTA_METRY } from '../constants/action_type';

const getCurveSt = state => state.curve;

function getMaxMinPeak(curve) {
  return curve.maxminPeak;
}

function* setCyclicVoltametry(action) {
  const curveSt = yield select(getCurveSt);
  const { listCurves } = curveSt;
  if (listCurves) {
    yield put(({
      type: CYCLIC_VOLTA_METRY.RESETALL,
      payload: null,
    }));

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
          payload: {peak: maxPeak, index: pidx, jcampIdx: index},
        }));

        const minPeak = maxminPeak.min[pidx];
        yield put(({
          type: CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
          payload: {peak: minPeak, index: pidx, jcampIdx: index},
        }));

        const pecker = maxminPeak.pecker[pidx];
        yield put(({
          type: CYCLIC_VOLTA_METRY.ADD_PECKER,
          payload: {peak: pecker, index: pidx, jcampIdx: index},
        }));
      }
    }
  }
}

const multiEntitiesSagas = [
  takeEvery(CURVE.SET_ALL_CURVES, setCyclicVoltametry),
];

export default multiEntitiesSagas;