'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var _list_ui = require('../constants/list_ui');

var initialState = {
  viewer: _list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM,
  sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN,
  sweepExtent: { xExtent: false, yExtent: false }
};

var uiReducer = function uiReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.UI.VIEWER.SET_TYPE:
      return Object.assign({}, state, {
        viewer: action.payload
      });
    case _action_type.UI.SWEEP.SET_TYPE:
      if (action.payload === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET) {
        return Object.assign({}, state, {
          sweepExtent: { xExtent: false, yExtent: false }
        });
      }
      return Object.assign({}, state, {
        sweepType: action.payload
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

exports.default = uiReducer;