import { put, takeEvery, select } from 'redux-saga/effects';

import { CURVE, CYCLIC_VOLTA_METRY } from '../constants/action_type';
import { LIST_LAYOUT } from '../constants/list_layout';

const getCurveSt = state => state.curve;
const getLayoutSt = state => state.layout;

function getMaxMinPeak(curve) {
  return curve.maxminPeak;
}

function* setCyclicVoltametry(action) {
  const layoutSt = yield select(getLayoutSt);
  if (layoutSt !== LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
    return
  }

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

// function* setInitData(action) {
//   const layoutSt = yield select(getLayoutSt);
//   console.log(layoutSt);
//   const curveSt = yield select(getCurveSt);
//   const { listCurves } = curveSt;
//   console.log(listCurves);
// }

const multiEntitiesSagas = [
  takeEvery(CURVE.SET_ALL_CURVES, setCyclicVoltametry),
  // takeEvery(CURVE.SET_ALL_CURVES, setInitData),
];

export default multiEntitiesSagas;