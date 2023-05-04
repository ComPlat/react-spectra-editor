"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _list_ui = require("../constants/list_ui");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  viewer: _list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM,
  sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN,
  sweepExtent: {
    xExtent: false,
    yExtent: false
  },
  jcampIdx: 0
};
const uiReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.UI.VIEWER.SET_TYPE:
      return Object.assign({}, state, {
        viewer: action.payload
      });
    case _action_type.UI.SWEEP.SET_TYPE:
      if (action.payload === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET) {
        return Object.assign({}, state, {
          sweepExtent: {
            xExtent: false,
            yExtent: false
          }
        });
      }
      return Object.assign({}, state, {
        sweepType: action.payload,
        jcampIdx: action.jcampIdx
      });
    case _action_type.UI.SWEEP.SELECT_ZOOMIN:
      return Object.assign({}, state, {
        sweepExtent: action.payload
      });
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};
var _default = uiReducer;
exports.default = _default;