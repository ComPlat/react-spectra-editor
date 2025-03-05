/* eslint-disable prefer-object-spread, default-param-last */
import { UI, MANAGER } from '../constants/action_type';
import {
  LIST_UI_VIEWER_TYPE,
  LIST_UI_SWEEP_TYPE,
} from '../constants/list_ui';

const initialState = {
  viewer: LIST_UI_VIEWER_TYPE.SPECTRUM,
  sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
  sweepExtent: { xExtent: false, yExtent: false },
  jcampIdx: 0,
  subViewerAt: { x: null, y: null },
  zoom: {
    graphIndex: 0,
    sweepExtent: [
      { xExtent: false, yExtent: false },
      { xExtent: false, yExtent: false },
      { xExtent: false, yExtent: false },
    ],
    sweepTypes: [
      LIST_UI_SWEEP_TYPE.ZOOMIN,
      LIST_UI_SWEEP_TYPE.ZOOMRESET,
      LIST_UI_SWEEP_TYPE.ZOOMRESET,
    ],
  },
};

const updateSweepType = (state, action) => {
  const { payload } = action;
  const { graphIndex, sweepType } = payload;
  if (!sweepType) {
    return Object.assign({}, state, {
      sweepType: action.payload,
      jcampIdx: action.jcampIdx,
    });
  }
  const { zoom } = state;
  let newSweepTypes = zoom.sweepTypes.slice();
  newSweepTypes[graphIndex] = sweepType;

  if (sweepType === LIST_UI_SWEEP_TYPE.ZOOMIN) {
    newSweepTypes = newSweepTypes.map((val, idx) => (
      idx === graphIndex
        ? LIST_UI_SWEEP_TYPE.ZOOMIN
        : LIST_UI_SWEEP_TYPE.ZOOMRESET
    ));
  }
  const newZoom = Object.assign({}, zoom, {
    sweepTypes: newSweepTypes,
    graphIndex,
  });
  return Object.assign({}, state, {
    zoom: newZoom,
    sweepType,
  });
};

const updateZoom = (state, action) => {
  const { payload } = action;
  const { graphIndex, zoomValue } = payload;
  if (!zoomValue) {
    return Object.assign({}, state, {
      sweepExtent: payload,
    });
  }
  const { zoom } = state;
  const { sweepExtent } = zoom;
  const selectedGraph = sweepExtent[graphIndex];
  const newSweepExtent = Object.assign({}, selectedGraph, zoomValue);
  sweepExtent[graphIndex] = newSweepExtent;
  const newZoom = Object.assign({}, zoom, { sweepExtent, graphIndex });
  return Object.assign({}, state, {
    zoom: newZoom,
  });
};

const resetZoom = (state, action) => {
  const { payload } = action;
  const { graphIndex } = payload;
  if (graphIndex === undefined) {
    return Object.assign({}, state, {
      sweepExtent: { xExtent: false, yExtent: false },
    });
  }
  const { zoom } = state;
  const { sweepExtent } = zoom;
  const selectedGraph = sweepExtent[graphIndex];
  const newSweepExtent = Object.assign({}, selectedGraph, { xExtent: false, yExtent: false });
  sweepExtent[graphIndex] = newSweepExtent;
  const newZoom = Object.assign({}, zoom, { sweepExtent, graphIndex });
  return Object.assign({}, state, {
    zoom: newZoom,
    sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
  });
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.VIEWER.SET_TYPE:
      return Object.assign({}, state, {
        viewer: action.payload,
      });
    case UI.SWEEP.SET_TYPE:
      if (action.payload.sweepType === LIST_UI_SWEEP_TYPE.ZOOMRESET
        || action.payload === LIST_UI_SWEEP_TYPE.ZOOMRESET) {
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
    case UI.SWEEP.SELECT_ZOOMIN: {
      // return Object.assign({}, state, {
      //   sweepExtent: action.payload,
      // });
      return updateZoom(state, action);
    }
    case UI.SUB_VIEWER.DISPLAY_VIEWER_AT:
      return Object.assign({}, state, {
        subViewerAt: action.payload,
      });
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default uiReducer;
