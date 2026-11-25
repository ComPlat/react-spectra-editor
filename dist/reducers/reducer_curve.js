"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _extractParams = require("../helpers/extractParams");
var _extractEntityLCMS = require("../helpers/extractEntityLCMS");
var _list_layout = require("../constants/list_layout");
var _chem = require("../helpers/chem");
var _format = _interopRequireDefault(require("../helpers/format"));
/* eslint-disable prefer-object-spread, default-param-last, max-len */

const initialState = {
  listCurves: [],
  curveIdx: 0,
  isShowAllCurve: false,
  isNormalized: false
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
  // The payload is the array of entities; a host's initial curve index comes in `meta`.
  const {
    payload
  } = action;
  const explicitIdx = action.meta?.curveIdx;
  if (!Array.isArray(payload)) return {
    ...state,
    curveIdx: 0,
    listCurves: []
  };
  const isLcmsGroup = (0, _extractEntityLCMS.isLcMsGroup)(payload);
  const entities = payload.map((entity, idx) => {
    const lcmsInfo = (0, _extractEntityLCMS.getLcMsInfo)(entity);
    const layout = isLcmsGroup && lcmsInfo.kind !== 'unknown' ? _list_layout.LIST_LAYOUT.LC_MS : entity.layout;
    const extracted = (0, _extractParams.extractParams)(entity, {
      isEdit: true
    }, null, {
      forceLcms: isLcmsGroup && lcmsInfo.kind !== 'unknown'
    });
    const {
      topic,
      feature,
      hasEdit,
      integration,
      multiplicity,
      features,
      entity: entityFromExtract,
      spectra
    } = extracted;
    let finalFeatures = features;
    if (!finalFeatures || Array.isArray(finalFeatures) && finalFeatures.length === 0) {
      finalFeatures = entityFromExtract?.features || entity.features || [];
    }
    const maxminPeak = (0, _chem.Convert2MaxMinPeak)(layout, feature, 0);
    const color = _format.default.mutiEntitiesColors(idx);
    const finalEntity = entityFromExtract || entity;
    const simulation = finalEntity.features && finalEntity.features.simulation;
    return {
      layout,
      lcmsKind: lcmsInfo.kind,
      lcmsPolarity: lcmsInfo.polarity,
      topic,
      feature,
      hasEdit,
      integration,
      multiplicity,
      simulation,
      maxminPeak,
      color,
      curveIdx: idx,
      features: finalFeatures,
      entity: finalEntity,
      spectra: spectra || entity.spectra
    };
  });
  const curveIdx = resolveCurveIdx(entities.length, state, explicitIdx);
  return {
    ...state,
    curveIdx,
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
    case _action_type.CURVE.SET_NORMALIZED:
      return Object.assign({}, state, {
        isNormalized: !!action.payload
      });
    default:
      return state;
  }
};
var _default = exports.default = curveReducer;