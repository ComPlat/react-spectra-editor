"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

// A layout the user picks by hand (the layout dropdown, r01_layout.js) for an
// unrecognized-datatype entity, so execReset can restore it across a refresh of the
// same dataset instead of forcing PLAIN back over it every time. See execReset's own
// comment (layer_init.js) for why this can't just be read back from state.layout: a
// child's RESETALL dispatch (e.g. ForecastViewer's mount-time reset, independent of
// any entity change) can also change that same state, in the same tick as the pick,
// in whichever order react-redux happens to schedule the two -- so state.layout does
// not reliably reflect "the last thing the user chose" at the point execReset needs
// it. This slice is written only by the dropdown's own dispatch, never by RESETALL,
// so it cannot be raced or clobbered by it.
//
// currentDatasetId is kept in step by execReset itself (the one place that already
// computes "which dataset is this"), so the dropdown's onChange can stamp a pick with
// the right dataset id without needing it threaded down as a prop.
const initialState = {
  currentDatasetId: null,
  override: null // { datasetId, layout } | null
};
const layoutOverrideReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.LAYOUT.SET_CURRENT_DATASET:
      return Object.assign({}, state, {
        currentDatasetId: action.payload
      });
    case _action_type.LAYOUT.SET_MANUAL_OVERRIDE:
      return Object.assign({}, state, {
        override: action.payload
      });
    default:
      return state;
  }
};
var _default = exports.default = layoutOverrideReducer;