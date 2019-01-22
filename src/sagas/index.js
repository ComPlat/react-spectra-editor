import { all } from 'redux-saga/effects';
import editPeakSagas from './saga_edit_peak';
import managerSagas from './saga_manager';


export default function* rootSaga() {
  yield all([
    ...editPeakSagas,
    ...managerSagas,
  ]);
}
