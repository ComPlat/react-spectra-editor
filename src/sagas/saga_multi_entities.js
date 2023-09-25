/* eslint-disable no-plusplus */
import { put, takeEvery, select } from 'redux-saga/effects';

import { CURVE, CYCLIC_VOLTA_METRY } from '../constants/action_type';
import { LIST_LAYOUT } from '../constants/list_layout';

const getLayoutSt = (state) => state.layout;
const getCurveSt = (state) => state.curve;

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

const multiEntitiesSagas = [
  takeEvery(CURVE.SET_ALL_CURVES, setCyclicVoltametry),
  takeEvery(CYCLIC_VOLTA_METRY.SET_FACTOR, setCyclicVoltametryRef),
];

export default multiEntitiesSagas;
