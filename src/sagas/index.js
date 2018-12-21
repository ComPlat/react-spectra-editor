import { all } from 'redux-saga/effects';
import editPeakSagas from './saga_edit_peak';

export default function* rootSaga() {
  yield all([
    ...editPeakSagas,
  ]);
}
