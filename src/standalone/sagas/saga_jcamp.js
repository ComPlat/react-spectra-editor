import base64 from 'base-64';
import {
  call, put, takeEvery,
} from 'redux-saga/effects';
import { FN } from '@complat/react-spectra-editor';

import { JCAMP, FILE } from '../constants/action_type';
import { VerifyJcampExt, VerifySize } from '../utils/util_file';
import FetcherFile from '../fetchers/fetcher_file';

function* addOthers(action) {
  const { payload } = action;
  const jcamp = payload.jcamps[0];
  const isValidJcampExt = VerifyJcampExt(jcamp);
  const isValidSize = VerifySize(jcamp);

  if (isValidJcampExt && isValidSize) {
    const rsp = yield call(FetcherFile.convertFile, { file: jcamp });

    if (rsp && rsp.status) {
      const origData = base64.decode(rsp.jcamp);
      const jcampData = FN.ExtractJcamp(origData);
      yield put({
        type: JCAMP.ADD_OTHERS_RDC,
        payload: Object.assign({}, { jcamp: jcampData }),
      });
    } else {
      yield put({
        type: FILE.CONVERT_FAIL,
        payload,
      });
    }
  } else {
    yield put({
      type: FILE.CONVERT_FAIL,
      payload,
    });
  }
}

const jcampSagas = [
  takeEvery(JCAMP.ADD_OTHERS_INIT, addOthers),
];

export default jcampSagas;
