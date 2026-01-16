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
  sweepExtentByCurve: {},
  jcampIdx: 0,
  alignCompareX: true,
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.VIEWER.SET_TYPE:
      return Object.assign({}, state, {
        viewer: action.payload,
      });
    case UI.SWEEP.SET_TYPE:
      if (action.payload === LIST_UI_SWEEP_TYPE.ZOOMRESET) {
        const curveIdx = typeof action.jcampIdx === 'number' ? action.jcampIdx : 0;
        return Object.assign({}, state, {
          sweepExtent: { xExtent: false, yExtent: false },
          sweepExtentByCurve: Object.assign(
            {},
            state.sweepExtentByCurve,
            { [curveIdx]: { xExtent: false, yExtent: false } },
          ),
        });
      }
      return Object.assign({}, state, {
        sweepType: action.payload,
        jcampIdx: action.jcampIdx,
      });
    case UI.SWEEP.SELECT_ZOOMIN:
    {
      const curveIdx = typeof action.curveIdx === 'number' ? action.curveIdx : 0;
      const nextSweepExtentByCurve = Object.assign(
        {},
        state.sweepExtentByCurve,
        { [curveIdx]: action.payload },
      );
      return Object.assign({}, state, {
        sweepExtent: action.payload,
        sweepExtentByCurve: nextSweepExtentByCurve,
      });
    }
    case UI.COMPARE.SET_ALIGN_X:
      return Object.assign({}, state, {
        alignCompareX: action.payload,
      });
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default uiReducer;
