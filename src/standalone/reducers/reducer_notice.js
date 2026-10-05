import {
  NOTICE, FILE, MOL, PREDICT,
} from '../constants/action_type';

const initialState = {
  status: false,
  message: false,
};

const sucConversionState = {
  status: 'success',
  message: 'Conversion success!',
};

const errConversionState = {
  status: 'error',
  message: 'Conversion error!',
};

const errFileState = {
  status: 'error',
  message: 'Invalid File: accept only [.dx, .jdx, .JCAMP, .RAW, .mz(X)ML, .cdf, .zip (Bruker FID folder)], [<30MB]',
};

const errMolState = {
  status: 'error',
  message: 'Invalid File: accept only [.mol], [<30MB]',
};

const warnUnknownState = {
  status: 'warning',
  message: 'Server not available!',
};

const buildPredictNotice = (state, action) => {
  if (!action.payload) return warnUnknownState;
  const { outline } = action.payload;
  const { code, text } = outline;
  const status = code <= 299 ? 'success' : 'error';
  if (code) {
    return Object.assign(
      {},
      state,
      {
        status,
        message: text,
      },
    );
  }
  return warnUnknownState;
};

const noticeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILE.ADD_FAIL:
      return Object.assign({}, state, errFileState);
    case MOL.ADD_FAIL:
      return Object.assign({}, state, errMolState);
    case FILE.CONVERT_DONE:
    case MOL.CONVERT_DONE:
      return Object.assign({}, state, sucConversionState);
    case FILE.CONVERT_FAIL:
    case MOL.CONVERT_FAIL:
      return Object.assign({}, state, errConversionState);
    case PREDICT.PREDICT_DONE:
    case PREDICT.PREDICT_FAIL:
    case PREDICT.ADD_PRED_JSON_INIT:
      return buildPredictNotice(state, action);
    case NOTICE.MANUAL_CLEAR:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
};

export default noticeReducer;
