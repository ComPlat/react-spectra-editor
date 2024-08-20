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
  jcampIdx: 0,
  subViewerAt: {
    x: null,
    y: null
  },
  zoom: {
    graphIndex: 0,
    sweepExtent: [{
      xExtent: false,
      yExtent: false
    }, {
      xExtent: false,
      yExtent: false
    }, {
      xExtent: false,
      yExtent: false
    }],
    sweepTypes: [_list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN, _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET, _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET]
  }
};
const updateSweepType = (state, action) => {
  const {
    payload
  } = action;
  const {
    graphIndex,
    sweepType
  } = payload;
  if (!sweepType) {
    return Object.assign({}, state, {
      sweepType: action.payload,
      jcampIdx: action.jcampIdx
    });
  }
  const {
    zoom
  } = state;
  const {
    sweepTypes
  } = zoom;
  sweepTypes[graphIndex] = sweepType;
  const newZoom = Object.assign({}, zoom, {
    sweepTypes,
    graphIndex
  });
  return Object.assign({}, state, {
    zoom: newZoom,
    sweepType
  });
};
const updateZoom = (state, action) => {
  const {
    payload
  } = action;
  const {
    graphIndex,
    zoomValue
  } = payload;
  if (!zoomValue) {
    return Object.assign({}, state, {
      sweepExtent: payload
    });
  }
  const {
    zoom
  } = state;
  const {
    sweepExtent
  } = zoom;
  const selectedGraph = sweepExtent[graphIndex];
  const newSweepExtent = Object.assign({}, selectedGraph, zoomValue);
  sweepExtent[graphIndex] = newSweepExtent;
  const newZoom = Object.assign({}, zoom, {
    sweepExtent,
    graphIndex
  });
  return Object.assign({}, state, {
    zoom: newZoom
  });
};
const resetZoom = (state, action) => {
  const {
    payload
  } = action;
  const {
    graphIndex
  } = payload;
  if (graphIndex === undefined) {
    return Object.assign({}, state, {
      sweepExtent: {
        xExtent: false,
        yExtent: false
      }
    });
  }
  const {
    zoom
  } = state;
  const {
    sweepExtent
  } = zoom;
  const selectedGraph = sweepExtent[graphIndex];
  const newSweepExtent = Object.assign({}, selectedGraph, {
    xExtent: false,
    yExtent: false
  });
  sweepExtent[graphIndex] = newSweepExtent;
  const newZoom = Object.assign({}, zoom, {
    sweepExtent,
    graphIndex
  });
  return Object.assign({}, state, {
    zoom: newZoom,
    sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN
  });
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
      if (action.payload.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET || action.payload === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET) {
        // return Object.assign({}, state, {
        //   sweepExtent: { xExtent: false, yExtent: false },
        // });
        return resetZoom(state, action);
      }
      // return Object.assign({}, state, {
      //   sweepType: action.payload,
      //   jcampIdx: action.jcampIdx,
      // });
      return updateSweepType(state, action);
    case _action_type.UI.SWEEP.SELECT_ZOOMIN:
      {
        // return Object.assign({}, state, {
        //   sweepExtent: action.payload,
        // });
        return updateZoom(state, action);
      }
    case _action_type.UI.SUB_VIEWER.DISPLAY_VIEWER_AT:
      return Object.assign({}, state, {
        subViewerAt: action.payload
      });
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};
var _default = exports.default = uiReducer;