/* eslint-disable prefer-object-spread, default-param-last */
import { CURVE } from '../constants/action_type';
import { extractParams } from '../helpers/extractParams';

import { Convert2MaxMinPeak } from '../helpers/chem';
import Format from '../helpers/format';

const initialState = {
  listCurves: [],
  curveIdx: 0,
};

const setAllCurves = (state, action) => {
  const { payload } = action;
  if (payload) {
    const entities = payload.map((entity, idx) => {
      const {
        topic, feature, hasEdit, integration,
      } = extractParams(entity, 1);
      // const layout = entity.layout;
      const { layout } = entity;
      const maxminPeak = Convert2MaxMinPeak(layout, feature, 0);
      const color = Format.mutiEntitiesColors(idx);
      return {
        layout, topic, feature, hasEdit, integration, maxminPeak, color, curveIdx: idx,
      };
    });

    return Object.assign({}, state, { curveIdx: 0, listCurves: entities });
  }
  return Object.assign({}, state, { curveIdx: 0, listCurves: payload });
};

const curveReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURVE.SELECT_WORKING_CURVE:
      return Object.assign({}, state, { curveIdx: action.payload });
    case CURVE.SET_ALL_CURVES:
      return setAllCurves(state, action);
    default:
      return state;
  }
};

export default curveReducer;
