/* eslint-disable prefer-object-spread, default-param-last, max-len */
import { CURVE } from '../constants/action_type';
import { extractParams } from '../helpers/extractParams';
import { getLcMsInfo, isLcMsGroup } from '../helpers/extractEntityLCMS';
import { LIST_LAYOUT } from '../constants/list_layout';

import { Convert2MaxMinPeak } from '../helpers/chem';
import Format from '../helpers/format';

const initialState = {
  listCurves: [],
  curveIdx: 0,
  isShowAllCurve: false,
};

const normalizeSetAllCurvesPayload = (payload) => {
  if (Array.isArray(payload)) {
    return { entities: payload, curveIdx: undefined };
  }
  if (payload && Array.isArray(payload.entities)) {
    return { entities: payload.entities, curveIdx: payload.curveIdx };
  }
  return { entities: null, curveIdx: undefined };
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
  const { entities: payloadEntities, curveIdx: explicitIdx } = normalizeSetAllCurvesPayload(action.payload);
  const payload = payloadEntities ?? action.payload;
  if (!payload) return { ...state, curveIdx: 0, listCurves: [] };

  const isLcmsGroup = isLcMsGroup(payload);
  const entities = payload.map((entity, idx) => {
    const lcmsInfo = getLcMsInfo(entity);
    const layout = (isLcmsGroup && lcmsInfo.kind !== 'unknown')
      ? LIST_LAYOUT.LC_MS
      : entity.layout;
    const extracted = extractParams(entity, { isEdit: true }, null, {
      forceLcms: isLcmsGroup && lcmsInfo.kind !== 'unknown',
    });
    const {
      topic, feature, hasEdit, integration, multiplicity, features, entity: entityFromExtract, spectra,
    } = extracted;

    let finalFeatures = features;
    if (!finalFeatures || (Array.isArray(finalFeatures) && finalFeatures.length === 0)) {
      finalFeatures = entityFromExtract?.features || entity.features || [];
    }

    const maxminPeak = Convert2MaxMinPeak(layout, feature, 0);
    const color = Format.mutiEntitiesColors(idx);
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
      spectra: spectra || entity.spectra,
    };
  });

  const curveIdx = resolveCurveIdx(entities.length, state, explicitIdx);

  return {
    ...state,
    curveIdx,
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
