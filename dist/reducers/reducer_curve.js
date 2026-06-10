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
const normalizeSetAllCurvesPayload = payload => {
  if (Array.isArray(payload)) {
    return {
      entities: payload,
      curveIdx: undefined
    };
  }
  if (payload && Array.isArray(payload.entities)) {
    return {
      entities: payload.entities,
      curveIdx: payload.curveIdx
    };
  }
  return {
    entities: null,
    curveIdx: undefined
  };
};
const resolveCurveIdx = (entitiesLength, state, explicitIdx) => {
  if (Number.isFinite(explicitIdx)) {
    const maxIdx = Math.max(0, entitiesLength - 1);
    return Math.min(Math.max(0, explicitIdx), maxIdx);
  }
  if (state.curveIdx >= 0 && state.curveIdx < entitiesLength) {
    return state.curveIdx;
  }
  return 0;
};
const setAllCurves = (state, action) => {
  const {
    entities,
    curveIdx: explicitIdx
  } = normalizeSetAllCurvesPayload(action.payload);
  if (entities) {
    const listCurves = entities.map((entity, idx) => {
      const {
        topic,
        feature,
        hasEdit,
        integration,
        multiplicity
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
        curveIdx: idx
      };
    });
    const curveIdx = resolveCurveIdx(entities.length, state, explicitIdx);
    return Object.assign({}, state, {
      curveIdx,
      listCurves
    });
  }
  return Object.assign({}, state, {
    curveIdx: 0,
    listCurves: entities
  });
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