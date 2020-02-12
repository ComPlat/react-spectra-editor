import { put, takeEvery } from 'redux-saga/effects';

import { META } from '../constants/action_type';
import { getPeakIntervals } from '../third_party/peakInterval';

function* updateMetaPeaks(action) {
  const { payload } = action;
  const { intervalL, intervalR } = getPeakIntervals(payload);
  const { observeFrequency, data } = payload.spectrum;
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

const metaSagas = [
  takeEvery(META.UPDATE_PEAKS, updateMetaPeaks),
];

export default metaSagas;
