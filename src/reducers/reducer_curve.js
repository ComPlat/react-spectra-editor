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
  if (payload) {
    const entities = payload.map((entity, idx) => {
      const {
        topic, feature, hasEdit, integration, multiplicity,
      } = extractParams(entity, { isEdit: true });
      const simulation = entity && entity.features ? entity.features.simulation : undefined;
      // const layout = entity.layout;
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
        simulation,
        maxminPeak,
        color,
        curveIdx: idx,
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
    case CURVE.SET_SHOULD_SHOW_ALL_CURVES:
      return Object.assign({}, state, { isShowAllCurve: action.payload });
    default:
      return state;
  }
};

export default curveReducer;
