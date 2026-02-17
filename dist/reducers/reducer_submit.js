"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _format = _interopRequireDefault(require("../helpers/format"));
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  isAscend: false,
  isIntensity: true,
  decimal: 2,
  operation: {
    name: 'empty'
  }
};
const updateOperation = action => ({
  operation: action.payload || initialState.operation
});
const submitReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.SUBMIT.TOGGLE_IS_ASCEND:
      return Object.assign({}, state, {
        isAscend: !state.isAscend
      });
    case _action_type.SUBMIT.TOGGLE_IS_INTENSITY:
      return Object.assign({}, state, {
        isIntensity: !state.isIntensity
      });
    case _action_type.SUBMIT.UPDATE_OPERATION:
      return Object.assign({}, state, updateOperation(action));
    case _action_type.SUBMIT.UPDATE_DECIMAL:
      return Object.assign({}, state, {
        decimal: action.payload.target.value
      });
    case _action_type.LAYOUT.UPDATE:
      {
        const decimal = _format.default.spectraDigit(action.payload);
        return Object.assign({}, state, {
          decimal
        });
      }
    case _action_type.MANAGER.RESETALL:
      {
        const decimal = _format.default.spectraDigit(action.payload.operation.layout);
        return Object.assign({}, state, {
          decimal,
          isIntensity: true,
          isAscend: false
        });
      }
    default:
      return state;
  }
};
var _default = exports.default = submitReducer;