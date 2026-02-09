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
    return {
      layout,
      lcmsKind: lcmsInfo.kind,
      lcmsPolarity: lcmsInfo.polarity,
      topic,
      feature,
      hasEdit,
      integration,
      multiplicity,
      maxminPeak,
      color,
      curveIdx: idx,
      features: finalFeatures,
      entity: entityFromExtract || entity,
      spectra: spectra || entity.spectra
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
const curveReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
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