import {
  call, put, takeEvery, select,
} from 'redux-saga/effects';

import { MOL } from '../constants/action_type';
import { VerifyMolExt, VerifySize } from '../utils/util_file';
import FetcherMol from '../fetchers/fetcher_mol';

function* analysisMol(action) {
  const { payload } = action;
  const { mol } = payload;
  const isValidMolExt = VerifyMolExt(mol);
  const isValidSize = VerifySize(mol);

  if (isValidMolExt && isValidSize) {
    yield put({
      type: MOL.ADD_DONE,
      payload,
    });
  } else {
    yield put({
      type: MOL.ADD_FAIL,
      payload,
    });
  }
}

const getMolSrc = state => state.mol.src;

function* convertMol(action) {
  const { payload } = action;
  const mol = payload.mol || (yield select(getMolSrc));
  const rsp = yield call(FetcherMol.convertMol, { mol });

  if (rsp && rsp.status) {
    const { smi, mass, svg } = rsp;
    yield put({
      type: MOL.CONVERT_DONE,
      payload: Object.assign({}, {
        mol, smi, mass, svg,
      }),
    });
  } else {
    yield put({
      type: MOL.CONVERT_FAIL,
      payload,
    });
  }
}

const molSagas = [
  takeEvery(MOL.ADD_INIT, analysisMol),
  takeEvery(MOL.ADD_DONE, convertMol),
];

export default molSagas;
