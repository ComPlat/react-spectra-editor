import { all } from 'redux-saga/effects';
import fileSagas from './saga_file';
import molSagas from './saga_mol';
import predictSagas from './saga_predict';
import jcampSagas from './saga_jcamp';

export default function* rootSaga() {
  yield all([
    ...fileSagas,
    ...molSagas,
    ...predictSagas,
    ...jcampSagas,
  ]);
}
