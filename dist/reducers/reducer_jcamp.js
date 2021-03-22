'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  others: [],
  addOthersCb: false
};

var addOthers = function addOthers(state, _ref) {
  var others = _ref.others,
      addOthersCb = _ref.addOthersCb;

  if (state.others.length > 5) return state;
  var decoOthers = others.map(function (o) {
    return Object.assign({}, o, { show: true });
  });

  return {
    others: [].concat(_toConsumableArray(state.others), _toConsumableArray(decoOthers)).slice(0, 5),
    addOthersCb: addOthersCb
  };
};

var rmOthersOne = function rmOthersOne(state, payload) {
  var idx = payload;
  var others = state.others;

  var nextOther = others.filter(function (_, i) {
    return i !== idx;
  });
  return Object.assign({}, state, { others: nextOther });
};

var toggleShow = function toggleShow(state, payload) {
  var idx = payload;
  var others = state.others;

  var nextOthers = others.map(function (o, i) {
    if (i !== idx) return o;
    var currentShow = o.show;
    return Object.assign({}, o, { show: !currentShow });
  });

  return Object.assign({}, state, { others: nextOthers });
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