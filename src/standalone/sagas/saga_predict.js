import {
  call, put, takeEvery,
} from 'redux-saga/effects';
import { FN } from '@complat/react-spectra-editor';

import { PREDICT, DESC } from '../constants/action_type';
import FetcherPredict from '../fetchers/fetcher_predict';
import { RmDollarSign } from '../utils/helper';


function* predictByServer(action) {
  const { payload } = action;

  const rsp = yield call(FetcherPredict.predict, payload);

  if (rsp && rsp.outline.code) {
    yield put({
      type: PREDICT.PREDICT_DONE,
      payload: rsp,
    });
  } else {
    yield put({
      type: PREDICT.PREDICT_FAIL,
      payload: rsp,
    });
  }
}

function* predictToWriteByServer(action) {
  const { payload } = action;
  const {
    peaks, layout, shift, isAscend, decimal,
  } = payload;
  const rsp = yield call(FetcherPredict.predict, payload);

  if (rsp && rsp.outline.code) {
    yield put({
      type: PREDICT.PREDICT_DONE,
      payload: rsp,
    });

    const predictions = rsp.output.result[0].shifts;
    const body = FN.formatPeaksByPrediction(
      peaks, layout, isAscend, decimal, predictions,
    );
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = RmDollarSign(wrapper.head) + body + wrapper.tail;
    yield put({
      type: DESC.UPDATE,
      payload: desc,
    });
  } else {
    yield put({
      type: PREDICT.PREDICT_FAIL,
      payload: rsp,
    });
  }
}

const predictSagas = [
  takeEvery(PREDICT.PREDICT_INIT, predictByServer),
  takeEvery(PREDICT.PREDICT_TO_WRITE_INIT, predictToWriteByServer),
];

export default predictSagas;
