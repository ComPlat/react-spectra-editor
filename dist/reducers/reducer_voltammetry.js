"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  spectraList: []
};
const initSpectra = {
  list: [],
  selectedIdx: -1,
  isWorkMaxPeak: true,
  jcampIdx: -1
};
const addPairPeak = (state, action) => {
  const {
    payload
  } = action;
  const {
    spectraList
  } = state;
  if (payload !== undefined) {
    let spectra = spectraList[payload];
    if (!spectra) {
      spectra = initSpectra;
      spectraList.push(spectra);
    }
    const {
      list,
      selectedIdx
    } = spectra;
    let index = selectedIdx;
    index += 1;
    const newList = list.map(item => {
      // eslint-disable-line
      return {
        ...item
      };
    });
    newList.push({
      min: null,
      max: null
    });
    spectraList[payload] = Object.assign({}, spectra, {
      list: newList,
      selectedIdx: index
    });
    return Object.assign({}, state, {
      spectraList
    });
  }
  return state;
};
const removePairPeak = (state, action) => {
  const {
    payload
  } = action;
  const {
    spectraList
  } = state;
  if (payload !== undefined) {
    const {
      index,
      jcampIdx
    } = payload;
    const spectra = spectraList[jcampIdx];
    if (spectra) {
      const {
        list
      } = spectra;
      list.splice(index, 1);
      spectraList[jcampIdx] = Object.assign({}, spectra, {
        list,
        selectedIdx: index
      });
      return Object.assign({}, state, {
        spectraList
      });
    }
    return state;
  }
  return state;
};
const addPeak = function (state, action) {
  let isMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  const {
    payload
  } = action;
  const {
    spectraList
  } = state;
  if (payload) {
    const {
      peak,
      index,
      jcampIdx
    } = payload;
    const spectra = spectraList[jcampIdx];
    const {
      list
    } = spectra;
    const newList = list.map(item => {
      // eslint-disable-line
      return {
        ...item
      };
    });
    let pairPeak = newList[index];
    if (isMax) {
      pairPeak = Object.assign({}, pairPeak, {
        max: peak
      });
    } else {
      pairPeak = Object.assign({}, pairPeak, {
        min: peak
      });
    }
    newList[index] = pairPeak;
    spectraList[jcampIdx] = Object.assign({}, spectra, {
      list: newList,
      selectedIdx: index,
      jcampIdx
    });
    return Object.assign({}, state, {
      spectraList
    });
  }
  return state;
};
const removePeak = function (state, action) {
  let isMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  const {
    payload
  } = action;
  const {
    spectraList
  } = state;
  if (payload) {
    const {
      index,
      jcampIdx
    } = payload;
    const spectra = spectraList[jcampIdx];
    const {
      list
    } = spectra;
    const newList = list;
    const pairPeak = newList[index];
    if (isMax) {
      pairPeak.max = null;
    } else {
      pairPeak.min = null;
    }
    newList[index] = pairPeak;
    spectraList[jcampIdx] = Object.assign({}, spectra, {
      list: newList,
      selectedIdx: index,
      jcampIdx
    });
    return Object.assign({}, state, {
      spectraList
    });
  }
  return state;
};
const selectPairPeak = (state, action) => {
  const {
    payload
  } = action;
  if (payload !== undefined) {
    const {
      spectraList
    } = state;
    const {
      index,
      jcampIdx
    } = payload;
    const spectra = spectraList[jcampIdx];
    if (spectra) {
      spectraList[jcampIdx] = Object.assign({}, spectra, {
        selectedIdx: index
      });
      return Object.assign({}, state, {
        spectraList
      });
    }
    return state;
  }
  return state;
};
const setWorkWithMaxPeak = (state, action) => {
  const {
    payload
  } = action;
  if (payload !== undefined) {
    const {
      spectraList
    } = state;
    const {
      isMax,
      jcampIdx
    } = payload;
    const spectra = spectraList[jcampIdx];
    if (spectra) {
      spectraList[jcampIdx] = Object.assign({}, spectra, {
        isWorkMaxPeak: isMax
      });
      return Object.assign({}, state, {
        spectraList
      });
    }
    return state;
  }
  return state;
};
const addPecker = (state, action) => {
  const {
    payload
  } = action;
  const {
    spectraList
  } = state;
  if (payload) {
    const {
      peak,
      index,
      jcampIdx
    } = payload;
    const spectra = spectraList[jcampIdx];
    const {
      list
    } = spectra;
    const newList = list;
    const pairPeak = newList[index];
    pairPeak.pecker = peak;
    newList[index] = pairPeak;
    spectraList[jcampIdx] = Object.assign({}, spectra, {
      list: newList,
      selectedIdx: index,
      jcampIdx
    });
    return Object.assign({}, state, {
      spectraList
    });
  }
  return state;
};
const removePecker = (state, action) => {
  const {
    payload
  } = action;
  const {
    spectraList
  } = state;
  if (payload) {
    const {
      index,
      jcampIdx
    } = payload;
    const spectra = spectraList[jcampIdx];
    const {
      list
    } = spectra;
    const newList = list;
    const pairPeak = newList[index];
    pairPeak.pecker = null;
    newList[index] = pairPeak;
    spectraList[jcampIdx] = Object.assign({}, spectra, {
      list: newList,
      selectedIdx: index,
      jcampIdx
    });
    return Object.assign({}, state, {
      spectraList
    });
  }
  return state;
};
const setRef = (state, action) => {
  const {
    payload
  } = action;
  // const { spectraList } = state;
  if (payload) {
    // const { index, jcampIdx } = payload;
    // const spectra = spectraList[jcampIdx];
    // const { list } = spectra;
    // const newList = list;
    // const pairPeak = newList[index];
    // pairPeak.pecker = null;
    // newList[index] = pairPeak;

    // spectraList[jcampIdx] = Object.assign(
    //   {},
    //   spectra,
    //   { list: newList, selectedIdx: index, jcampIdx },
    // );
    // return Object.assign({}, state, { spectraList: spectraList });

    // TODO: implement ref
    // console.log(pairPeak);
  }
  return state;
};
const cyclicVoltaReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS:
      return addPairPeak(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.REMOVE_PAIR_PEAKS:
      return removePairPeak(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.ADD_MAX_PEAK:
      return addPeak(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK:
      return removePeak(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.ADD_MIN_PEAK:
      return addPeak(state, action, false);
    case _action_type.CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK:
      return removePeak(state, action, false);
    case _action_type.CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK:
      return setWorkWithMaxPeak(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.SELECT_PAIR_PEAK:
      return selectPairPeak(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.ADD_PECKER:
      return addPecker(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.REMOVE_PECKER:
      return removePecker(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.SET_REF:
      return setRef(state, action);
    case _action_type.CYCLIC_VOLTA_METRY.RESETALL:
      return Object.assign({}, state, {
        spectraList: []
      });
    default:
      return state;
  }
};
var _default = cyclicVoltaReducer;
exports.default = _default;