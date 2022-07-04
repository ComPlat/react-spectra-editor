"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _action_type = require("../constants/action_type");

var initialState = {
  spectraList: []
};

var initSpectra = {
  list: [],
  selectedIdx: -1,
  isWorkMaxPeak: true,
  jcampIdx: -1
};

var addPairPeak = function addPairPeak(state, action) {
  var payload = action.payload;
  var spectraList = state.spectraList;

  if (payload !== undefined) {
    var spectra = spectraList[payload];
    if (!spectra) {
      spectra = initSpectra;
      spectraList.push(spectra);
    }
    var _spectra = spectra,
        list = _spectra.list,
        selectedIdx = _spectra.selectedIdx;

    var index = selectedIdx;
    index += 1;
    var newList = list.map(function (item) {
      return _extends({}, item);
    });
    newList.push({ min: null, max: null });

    spectraList[payload] = Object.assign({}, spectra, { list: newList, selectedIdx: index });
    return Object.assign({}, state, { spectraList: spectraList });
  } else {
    return state;
  }
};

var removePairPeak = function removePairPeak(state, action) {
  var payload = action.payload;
  var spectraList = state.spectraList;

  if (payload !== undefined) {
    var index = payload.index,
        jcampIdx = payload.jcampIdx;

    var spectra = spectraList[jcampIdx];
    if (spectra) {
      var list = spectra.list;

      list.splice(index, 1);
      spectraList[jcampIdx] = Object.assign({}, spectra, { list: list, selectedIdx: index });
      return Object.assign({}, state, { spectraList: spectraList });
    }
    return state;
  } else {
    return state;
  }
};

var addPeak = function addPeak(state, action) {
  var isMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var payload = action.payload;
  var spectraList = state.spectraList;

  if (payload) {
    var peak = payload.peak,
        index = payload.index,
        jcampIdx = payload.jcampIdx;

    var spectra = spectraList[jcampIdx];
    var list = spectra.list;

    var newList = list.map(function (item) {
      return _extends({}, item);
    });
    var pairPeak = newList[index];
    if (isMax) {
      pairPeak = Object.assign({}, pairPeak, { max: peak });
    } else {
      pairPeak = Object.assign({}, pairPeak, { min: peak });
    }
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign({}, spectra, { list: newList, selectedIdx: index, jcampIdx: jcampIdx });
    return Object.assign({}, state, { spectraList: spectraList });
  } else {
    return state;
  }
};

var removePeak = function removePeak(state, action) {
  var isMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var payload = action.payload;
  var spectraList = state.spectraList;

  if (payload) {
    var index = payload.index,
        jcampIdx = payload.jcampIdx;

    var spectra = spectraList[jcampIdx];
    var list = spectra.list;

    var newList = list;
    var pairPeak = newList[index];
    if (isMax) {
      pairPeak.max = null;
    } else {
      pairPeak.min = null;
    }
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign({}, spectra, { list: newList, selectedIdx: index, jcampIdx: jcampIdx });
    return Object.assign({}, state, { spectraList: spectraList });
  } else {
    return state;
  }
};

var selectPairPeak = function selectPairPeak(state, action) {
  var payload = action.payload;

  if (payload !== undefined) {
    var spectraList = state.spectraList;
    var index = payload.index,
        jcampIdx = payload.jcampIdx;

    var spectra = spectraList[jcampIdx];
    if (spectra) {
      spectraList[jcampIdx] = Object.assign({}, spectra, { selectedIdx: index });
      return Object.assign({}, state, { spectraList: spectraList });
    }
    return state;
  } else {
    return state;
  }
};

var setWorkWithMaxPeak = function setWorkWithMaxPeak(state, action) {
  var payload = action.payload;

  if (payload !== undefined) {
    var spectraList = state.spectraList;
    var isMax = payload.isMax,
        jcampIdx = payload.jcampIdx;

    var spectra = spectraList[jcampIdx];
    if (spectra) {
      spectraList[jcampIdx] = Object.assign({}, spectra, { isWorkMaxPeak: isMax });
      return Object.assign({}, state, { spectraList: spectraList });
    }
    return state;
  } else {
    return state;
  }
};

var addPecker = function addPecker(state, action) {
  var payload = action.payload;
  var spectraList = state.spectraList;

  if (payload) {
    var peak = payload.peak,
        index = payload.index,
        jcampIdx = payload.jcampIdx;

    var spectra = spectraList[jcampIdx];
    var list = spectra.list;

    var newList = list;
    var pairPeak = newList[index];
    pairPeak.pecker = peak;
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign({}, spectra, { list: newList, selectedIdx: index, jcampIdx: jcampIdx });
    return Object.assign({}, state, { spectraList: spectraList });
  } else {
    return state;
  }
};

var removePecker = function removePecker(state, action) {
  var payload = action.payload;
  var spectraList = state.spectraList;

  if (payload) {
    var index = payload.index,
        jcampIdx = payload.jcampIdx;

    var spectra = spectraList[jcampIdx];
    var list = spectra.list;

    var newList = list;
    var pairPeak = newList[index];
    pairPeak.pecker = null;
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign({}, spectra, { list: newList, selectedIdx: index, jcampIdx: jcampIdx });
    return Object.assign({}, state, { spectraList: spectraList });
  } else {
    return state;
  }
};

var cyclicVoltaReducer = function cyclicVoltaReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

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
    case _action_type.CYCLIC_VOLTA_METRY.RESETALL:
      return Object.assign({}, state, { spectraList: [] });
    default:
      return state;
  }
};

exports.default = cyclicVoltaReducer;