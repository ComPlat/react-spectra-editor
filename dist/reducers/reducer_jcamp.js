'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  selectedIdx: 0,
  jcamps: [{
    others: [],
    addOthersCb: false
  }]
};

var addOthers = function addOthers(state, _ref) {
  var others = _ref.others,
      addOthersCb = _ref.addOthersCb;
  var selectedIdx = state.selectedIdx,
      jcamps = state.jcamps;

  var selectedJcamp = jcamps[selectedIdx];

  if (selectedJcamp.others.length > 5) return state;
  var decoOthers = others.map(function (o) {
    return Object.assign({}, o, { show: true });
  });

  var newJcamp = Object.assign({}, selectedJcamp, { others: [].concat(_toConsumableArray(selectedJcamp.others), _toConsumableArray(decoOthers)).slice(0, 5), addOthersCb: addOthersCb });
  jcamps[selectedIdx] = newJcamp;

  return Object.assign({}, state, { jcamps: jcamps });
};

var rmOthersOne = function rmOthersOne(state, payload) {
  var selectedIdx = state.selectedIdx,
      jcamps = state.jcamps;

  var selectedJcamp = jcamps[selectedIdx];

  var idx = payload;
  var others = selectedJcamp.others;

  var nextOther = others.filter(function (_, i) {
    return i !== idx;
  });

  var newJcamp = Object.assign({}, selectedJcamp, { others: nextOther });
  jcamps[selectedIdx] = newJcamp;
  return Object.assign({}, state, { jcamps: jcamps });
};

var toggleShow = function toggleShow(state, payload) {
  var selectedIdx = state.selectedIdx,
      jcamps = state.jcamps;

  var selectedJcamp = jcamps[selectedIdx];

  var idx = payload;
  var others = selectedJcamp.others;

  var nextOthers = others.map(function (o, i) {
    if (i !== idx) return o;
    var currentShow = o.show;
    return Object.assign({}, o, { show: !currentShow });
  });

  var newJcamp = Object.assign({}, selectedJcamp, { others: nextOthers });
  jcamps[selectedIdx] = newJcamp;
  return Object.assign({}, state, { jcamps: jcamps });
};

var layoutReducer = function layoutReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.JCAMP.ADD_OTHERS:
      return addOthers(state, action.payload);
    case _action_type.JCAMP.RM_OTHERS_ONE:
      return rmOthersOne(state, action.payload);
    case _action_type.JCAMP.TOGGLE_SHOW:
      return toggleShow(state, action.payload);
    case _action_type.JCAMP.CLEAR_ALL:
      return initialState;
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

exports.default = layoutReducer;