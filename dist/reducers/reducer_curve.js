"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _extractParams = require("../helpers/extractParams");
var _chem = require("../helpers/chem");
var _format = _interopRequireDefault(require("../helpers/format"));
/* eslint-disable prefer-object-spread, default-param-last, max-len */

const initialState = {
  listCurves: [],
  curveIdx: 0,
  isShowAllCurve: false
};
const setAllCurves = (state, action) => {
  const {
    payload
  } = action;
  if (!payload) return {
    ...state,
    curveIdx: 0,
    listCurves: []
  };
  const entities = payload.map((entity, idx) => {
    const {
      topic,
      feature,
      hasEdit,
      integration,
      multiplicity,
      features
    } = (0, _extractParams.extractParams)(entity, {
      isEdit: true
    });
    const {
      layout
    } = entity;
    const maxminPeak = (0, _chem.Convert2MaxMinPeak)(layout, feature, 0);
    const color = _format.default.mutiEntitiesColors(idx);
    return {
      layout,
      topic,
      feature,
      hasEdit,
      integration,
      multiplicity,
      maxminPeak,
      color,
      curveIdx: idx,
      features
    };
  });
  const maxIdx = entities.length - 1;
  const safeCurveIdx = Math.min(state.curveIdx || 0, maxIdx);
  return {
    ...state,
    curveIdx: safeCurveIdx,
    listCurves: entities
  };
};
const curveReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.CURVE.SELECT_WORKING_CURVE:
      return Object.assign({}, state, {
        curveIdx: action.payload
      });
    case _action_type.CURVE.SET_ALL_CURVES:
      return setAllCurves(state, action);
    case _action_type.CURVE.SET_SHOULD_SHOW_ALL_CURVES:
      return Object.assign({}, state, {
        isShowAllCurve: action.payload
      });
    default:
      return state;
  }
};
var _default = exports.default = curveReducer;