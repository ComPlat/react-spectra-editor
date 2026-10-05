import { FILE, MOL } from '../constants/action_type';

const initialState = {
  src: false,
  dst: false,
  jcamp: false,
  img: false,
  jcampList: false,
  dstList: false,
};

const updateConversion = (state, action) => {
  const { payload } = action;
  const {
    file, dst, jcamp, img, jcampList, dstList,
  } = payload;
  return Object.assign(
    {},
    state,
    {
      src: file,
      dst,
      jcamp,
      img,
      jcampList,
      dstList,
    },
  );
};

const insertFile = (state, action) => {
  const { payload } = action;
  const { file } = payload;
  return Object.assign(
    {},
    state,
    {
      src: file,
      dst: false,
      jcamp: false,
      img: false,
      jcampList: false,
      dstList: false,
    },
  );
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILE.ADD_DONE:
      return insertFile(state, action);
    case FILE.CONVERT_DONE:
      return updateConversion(state, action);
    case FILE.ADD_FAIL:
    case FILE.CONVERT_FAIL:
    case MOL.ADD_FAIL:
    case MOL.CONVERT_DONE:
    case MOL.CONVERT_FAIL:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
};

export default fileReducer;
