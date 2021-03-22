'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var _format = require('../helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  isAscend: false,
  isIntensity: true,
  decimal: 2,
  operation: { name: 'empty' }
};

var updateOperation = function updateOperation(action) {
  return { operation: action.payload || initialState.operation };
};

var submitReducer = function submitReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.SUBMIT.TOGGLE_IS_ASCEND:
      return Object.assign({}, state, { isAscend: !state.isAscend });
    case _action_type.SUBMIT.TOGGLE_IS_INTENSITY:
      return Object.assign({}, state, { isIntensity: !state.isIntensity });
    case _action_type.SUBMIT.UPDATE_OPERATION:
      return Object.assign({}, state, updateOperation(action));
    case _action_type.SUBMIT.UPDATE_DECIMAL:
      return Object.assign({}, state, { decimal: action.payload.target.value });
    case _action_type.LAYOUT.UPDATE:
      {
        var decimal = _format2.default.spectraDigit(action.payload);
        return Object.assign({}, state, { decimal: decimal });
      }
    case _action_type.MANAGER.RESETALL:
      {
        var _decimal = _format2.default.spectraDigit(action.payload.operation.layout);
        return Object.assign({}, state, { decimal: _decimal, isIntensity: true, isAscend: false });
      }
    default:
      return state;
  }
};

exports.default = submitReducer;