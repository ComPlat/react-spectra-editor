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
  sweepExtentByCurve: {},
  jcampIdx: 0,
  alignCompareX: true
};
const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.UI.VIEWER.SET_TYPE:
      return Object.assign({}, state, {
        viewer: action.payload
      });
    case _action_type.UI.SWEEP.SET_TYPE:
      if (action.payload === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET) {
        const curveIdx = typeof action.jcampIdx === 'number' ? action.jcampIdx : 0;
        return Object.assign({}, state, {
          sweepExtent: {
            xExtent: false,
            yExtent: false
          },
          sweepExtentByCurve: Object.assign({}, state.sweepExtentByCurve, {
            [curveIdx]: {
              xExtent: false,
              yExtent: false
            }
          })
        });
      }
      return Object.assign({}, state, {
        sweepType: action.payload,
        jcampIdx: action.jcampIdx
      });
    case _action_type.UI.SWEEP.SELECT_ZOOMIN:
      {
        const curveIdx = typeof action.curveIdx === 'number' ? action.curveIdx : 0;
        const nextSweepExtentByCurve = Object.assign({}, state.sweepExtentByCurve, {
          [curveIdx]: action.payload
        });
        return Object.assign({}, state, {
          sweepExtent: action.payload,
          sweepExtentByCurve: nextSweepExtentByCurve
        });
      }
    case _action_type.UI.COMPARE.SET_ALIGN_X:
      return Object.assign({}, state, {
        alignCompareX: action.payload
      });
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};
var _default = exports.default = uiReducer;