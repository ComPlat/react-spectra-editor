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
      jcampIdx: action.jcampIdx,
      zoom: {
        ...state.zoom,
        sweepTypes: [_list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET, _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET, _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET]
      }
    });
  }
  const {
    zoom
  } = state;
  let newSweepTypes = zoom.sweepTypes.slice();
  newSweepTypes[graphIndex] = sweepType;
  if (sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN) {
    newSweepTypes = newSweepTypes.map((val, idx) => idx === graphIndex ? _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN : _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET);
  }
  const newZoom = Object.assign({}, zoom, {
    sweepTypes: newSweepTypes,
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
  return Object.assign({}, state, {
    zoom: {
      sweepExtent,
      graphIndex,
      sweepTypes: [_list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET, _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET, _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET]
    },
    sweepType: _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET
  });
};
const uiReducer = (state = initialState, action) => {
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