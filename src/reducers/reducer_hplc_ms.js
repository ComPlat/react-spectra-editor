/* eslint-disable prefer-object-spread, default-param-last */
import { HPLC_MS, CURVE, THRESHOLD } from '../constants/action_type';
import Format from '../helpers/format';

const initialState = {
  uvvis: {
    listWaveLength: null,
    selectedWaveLength: null,
    wavelengthIdx: 0,
  },
  tic: {
    isNegative: false,
  },
  threshold: {
    isEdit: true,
    value: false,
  },
};

const updateHPLCData = (state, action) => {
  const { payload } = action;
  if (payload && payload.length > 0) {
    const { layout } = payload[0];
    if (!Format.isLCMsLayout(layout)) {
      return state;
    }
    const uvvisCurve = payload[2];
    const { features } = uvvisCurve;
    const listWaveLength = features.map((fe) => fe.pageValue);
    const { uvvis } = state;
    const newUvvis = Object.assign({}, uvvis, {
      listWaveLength,
      selectedWaveLength: listWaveLength[0],
    });
    const postiveCurves = payload[3];
    const { thresRef } = postiveCurves.features[0];
    return Object.assign({}, state, {
      uvvis: newUvvis,
      threshold: {
        isEdit: true,
        value: thresRef,
      },
    });
  }
  return state;
};

const updateWaveLength = (state, action) => {
  const { payload } = action;
  if (payload) {
    const { value } = payload.target;
    const { uvvis } = state;
    const { listWaveLength } = uvvis;
    const wavelengthIdx = listWaveLength.indexOf(value);
    const newUvvis = Object.assign({}, uvvis, {
      selectedWaveLength: value,
      wavelengthIdx,
    });
    return Object.assign({}, state, {
      uvvis: newUvvis,
    });
  }
  return state;
};

const updateTic = (state, action) => {
  const { payload } = action;
  if (payload) {
    const { value } = payload.target;
    const { tic } = state;
    const isNegative = value === 1;
    const newTic = Object.assign({}, tic, {
      isNegative,
    });
    return Object.assign({}, state, {
      tic: newTic,
    });
  }
  return state;
};

const updateThresholdValue = (state, action) => {
  const { payload } = action;
  if (payload) {
    const { value } = payload;
    return Object.assign({}, state, {
      threshold: {
        isEdit: true,
        value,
      },
    });
  }
  return state;
};

const hplcmsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURVE.SET_ALL_CURVES:
      return updateHPLCData(state, action);
    case HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH:
      return updateWaveLength(state, action);
    case HPLC_MS.SELECT_TIC_CURVE:
      return updateTic(state, action);
    case THRESHOLD.UPDATE_VALUE:
      return updateThresholdValue(state, action);
    default:
      return state;
  }
};

export default hplcmsReducer;
