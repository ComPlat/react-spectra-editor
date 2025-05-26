/* eslint-disable prefer-object-spread, default-param-last, max-len */
import { CURVE } from '../constants/action_type';
import { extractParams } from '../helpers/extractParams';

import { Convert2MaxMinPeak } from '../helpers/chem';
import Format from '../helpers/format';

const initialState = {
  listCurves: [],
  curveIdx: 0,
  isShowAllCurve: false,
};

const setAllCurves = (state, action) => {
  const { payload } = action;
  if (!payload) return { ...state, curveIdx: 0, listCurves: [] };

  const entities = payload.map((entity, idx) => {
    const {
      topic, feature, hasEdit, integration, multiplicity, features,
    } = extractParams(entity, { isEdit: true });

    const { layout } = entity;
    const maxminPeak = Convert2MaxMinPeak(layout, feature, 0);
    const color = Format.mutiEntitiesColors(idx);
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
      features,
    };
  });

  const maxIdx = entities.length - 1;
  const safeCurveIdx = Math.min(state.curveIdx || 0, maxIdx);

  return {
    ...state,
    curveIdx: safeCurveIdx,
    listCurves: entities,
  };
};

const curveReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURVE.SELECT_WORKING_CURVE:
      return Object.assign({}, state, { curveIdx: action.payload });
    case CURVE.SET_ALL_CURVES:
      return setAllCurves(state, action);
    case CURVE.SET_SHOULD_SHOW_ALL_CURVES:
      return Object.assign({}, state, { isShowAllCurve: action.payload });
    default:
      return state;
  }
};

export default curveReducer;
