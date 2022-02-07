import { all } from 'redux-saga/effects';
import editPeakSagas from './saga_edit_peak';
import managerSagas from './saga_manager';
import uiSagas from './saga_ui';
import metaSagas from './saga_meta';
import multiplicitySagas from './saga_multiplicity';
import multiEntitiesSagas from './saga_multi_entities';

export default function* rootSaga() {
  yield all([
    ...editPeakSagas,
    ...managerSagas,
    ...uiSagas,
    ...metaSagas,
    ...multiplicitySagas,
    ...multiEntitiesSagas,
  ]);
}
