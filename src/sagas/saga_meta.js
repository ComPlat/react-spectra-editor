import { put, takeEvery } from 'redux-saga/effects';

import { META } from '../constants/action_type';
import { getPeakIntervals } from '../third_party/peakInterval';

function* updateMetaPeaks(action) {
  const { payload } = action;
  const { intervalL, intervalR } = getPeakIntervals(payload);
  const { observeFrequency, data } = payload.spectra[0];
  const deltaX = Math.abs(data[0].x[0] - data[0].x[1]);

  yield put({
    type: META.UPDATE_PEAKS_RDC,
    payload: {
      peaks: {
        intervalL, intervalR, observeFrequency, deltaX,
      },
    },
  });
}

function* updateMetaData(action) {
  yield put({
    type: META.UPDATE_META_DATA_RDC,
    payload: {
      dscMetaData: action.payload,
    },
  });
}

const metaSagas = [
  takeEvery(META.UPDATE_PEAKS, updateMetaPeaks),
  takeEvery(META.UPDATE_META_DATA, updateMetaData),
];

export default metaSagas;
