import { put } from 'redux-saga/effects';

import { UI, HPLC_MS } from '../constants/action_type';

export function* lcmsHandleSelectZoomIn({ payload, zoom }) {
  const { graphIndex } = zoom;
  let lcmsSyncX;
  if ((graphIndex === 0 || graphIndex === 1) && payload?.xExtent) {
    lcmsSyncX = graphIndex === 0 ? 1 : 0;
  }
  yield put({
    type: UI.SWEEP.SELECT_ZOOMIN,
    payload: {
      graphIndex,
      zoomValue: payload,
      ...(lcmsSyncX != null ? { lcmsSyncX } : {}),
    },
  });
}

export function* lcmsHandleSelectZoomReset() {
  yield put({
    type: UI.SWEEP.SELECT_ZOOMRESET,
    payload: { graphIndex: 0 },
  });
  yield put({
    type: UI.SWEEP.SELECT_ZOOMRESET,
    payload: { graphIndex: 1 },
  });
}

export function* lcmsHandleIntegrationAdd({ uvvis, payload }) {
  yield put({
    type: HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
    payload: {
      spectrumId: uvvis.selectedWaveLength,
      integration: payload,
    },
  });
}

export function* lcmsHandlePeakDelete({ uvvis, payload }) {
  yield put({
    type: HPLC_MS.REMOVE_HPLCMS_PEAK,
    payload: {
      spectrumId: uvvis.selectedWaveLength,
      peak: payload,
    },
  });
}

export function* lcmsHandleIntegrationRm({ uvvis, payload }) {
  yield put({
    type: HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
    payload: {
      spectrumId: uvvis.selectedWaveLength,
      integration: payload,
      remove: true,
    },
  });
}
