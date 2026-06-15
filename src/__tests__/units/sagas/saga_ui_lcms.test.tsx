import { put, select } from 'redux-saga/effects';

import managerSagas, { shouldDisplayLcmsSubViewerAt } from '../../../sagas/saga_ui';
import {
  UI, EDITPEAK, INTEGRATION, HPLC_MS,
} from '../../../constants/action_type';
import { LIST_UI_SWEEP_TYPE } from '../../../constants/list_ui';
import { LIST_LAYOUT } from '../../../constants/list_layout';

const findSagaByActionType = (actionType: string) => {
  const entry = managerSagas.find((s: any) => s?.payload?.args?.[0] === actionType);
  if (!entry) {
    throw new Error(`No saga registered for ${actionType}`);
  }
  return (entry as any).payload.args[1];
};

const selectUiSweep = findSagaByActionType(UI.SWEEP.SELECT);
const clickUiTarget = findSagaByActionType(UI.CLICK_TARGET);

const drainSelects = (
  iter: any,
  values: any[],
) => {
  let { value, done } = iter.next();
  let i = 0;
  while (!done && value && value.type === 'SELECT') {
    if (i >= values.length) {
      throw new Error('Not enough mock values for selects');
    }
    ({ value, done } = iter.next(values[i]));
    i += 1;
  }
  return { value, done };
};

describe('saga_ui — LCMS branches in selectUiSweep', () => {
  const baseState = {
    ui: {
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
      zoom: { graphIndex: 0 },
    },
    curve: { curveIdx: 0 },
    hplcMs: { uvvis: { listWaveLength: [230, 254], selectedWaveLength: 254 } },
    layout: LIST_LAYOUT.LC_MS,
  };

  it('ZOOMIN on graph 0 in LCMS dispatches lcmsSyncX = 1', () => {
    const action = {
      type: UI.SWEEP.SELECT,
      payload: { xExtent: { xL: 0.1, xU: 0.5 } },
    } as any;
    const iter = selectUiSweep(action);

    const { value } = drainSelects(iter, [
      baseState.ui,
      baseState.curve,
      baseState.hplcMs,
      baseState.layout,
    ]);

    expect(value).toEqual(put({
      type: UI.SWEEP.SELECT_ZOOMIN,
      payload: {
        graphIndex: 0,
        zoomValue: action.payload,
        lcmsSyncX: 1,
      },
    }));
  });

  it('ZOOMIN on graph 1 in LCMS dispatches lcmsSyncX = 0', () => {
    const action = {
      type: UI.SWEEP.SELECT,
      payload: { xExtent: { xL: 0.1, xU: 0.5 } },
    } as any;
    const iter = selectUiSweep(action);

    const { value } = drainSelects(iter, [
      { ...baseState.ui, zoom: { graphIndex: 1 } },
      baseState.curve,
      baseState.hplcMs,
      baseState.layout,
    ]);

    expect(value).toEqual(put({
      type: UI.SWEEP.SELECT_ZOOMIN,
      payload: {
        graphIndex: 1,
        zoomValue: action.payload,
        lcmsSyncX: 0,
      },
    }));
  });

  it('ZOOMIN outside LC_MS layout dispatches plain payload (no lcmsSyncX)', () => {
    const action = {
      type: UI.SWEEP.SELECT,
      payload: { xExtent: { xL: 0.1, xU: 0.5 } },
    } as any;
    const iter = selectUiSweep(action);

    const { value } = drainSelects(iter, [
      baseState.ui,
      baseState.curve,
      { uvvis: {} },
      LIST_LAYOUT.H1,
    ]);

    expect(value).toEqual(put({
      type: UI.SWEEP.SELECT_ZOOMIN,
      payload: action.payload,
    }));
  });

  it('ZOOMRESET on graph 0 in LCMS resets graphs 0 then 1', () => {
    const action = {
      type: UI.SWEEP.SELECT,
      payload: { graphIndex: 0 },
    } as any;
    const iter = selectUiSweep(action);

    const { value: first } = drainSelects(iter, [
      { ...baseState.ui, sweepType: LIST_UI_SWEEP_TYPE.ZOOMRESET },
      baseState.curve,
      baseState.hplcMs,
      baseState.layout,
    ]);
    expect(first).toEqual(put({
      type: UI.SWEEP.SELECT_ZOOMRESET,
      payload: { graphIndex: 0 },
    }));
    const { value: second } = iter.next();
    expect(second).toEqual(put({
      type: UI.SWEEP.SELECT_ZOOMRESET,
      payload: { graphIndex: 1 },
    }));
  });

  it('INTEGRATION_ADD on LCMS with selectedWaveLength dispatches HPLC_MS update', () => {
    const action = {
      type: UI.SWEEP.SELECT,
      payload: { xL: 1, xU: 2 },
    } as any;
    const iter = selectUiSweep(action);

    const { value } = drainSelects(iter, [
      { ...baseState.ui, sweepType: LIST_UI_SWEEP_TYPE.INTEGRATION_ADD },
      baseState.curve,
      baseState.hplcMs,
      baseState.layout,
    ]);

    expect(value).toEqual(put({
      type: HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
      payload: {
        spectrumId: 254,
        integration: action.payload,
      },
    }));
  });

  it('INTEGRATION_ADD outside LCMS keeps the generic UI integration path', () => {
    const action = {
      type: UI.SWEEP.SELECT,
      payload: { xL: 1, xU: 2 },
    } as any;
    const iter = selectUiSweep(action);

    const { value } = drainSelects(iter, [
      { ...baseState.ui, sweepType: LIST_UI_SWEEP_TYPE.INTEGRATION_ADD },
      baseState.curve,
      { uvvis: {} },
      LIST_LAYOUT.H1,
    ]);

    expect(value).toEqual(put({
      type: UI.SWEEP.SELECT_INTEGRATION,
      payload: { newData: action.payload, curveIdx: baseState.curve.curveIdx },
    }));
  });
});

describe('saga_ui — clickUiTarget LCMS branches', () => {
  const lcmsState = {
    uvvis: { selectedWaveLength: 280, currentSpectrum: { peaks: [] } },
  };

  it('opens the LCMS subviewer when click comes from TIC in zoom mode', () => {
    const action = {
      type: UI.CLICK_TARGET,
      payload: { x: 1.5, y: 0 },
      sourceHint: 'lcms_tic',
      onPeak: false,
      onPecker: false,
      voltammetryPeakIdx: 0,
    } as any;
    const iter = clickUiTarget(action);

    const { value } = drainSelects(iter, [
      LIST_UI_SWEEP_TYPE.ZOOMIN,
      { curveIdx: 0 },
      lcmsState,
      LIST_LAYOUT.LC_MS,
    ]);

    expect(value).toEqual(put({
      type: UI.SUB_VIEWER.DISPLAY_VIEWER_AT,
      payload: action.payload,
    }));
  });

  it('PEAK_ADD on LCMS dispatches UPDATE_HPLCMS_PEAKS with selected wavelength', () => {
    const action = {
      type: UI.CLICK_TARGET,
      payload: { x: 5, y: 10 },
      sourceHint: null,
      onPeak: false,
      onPecker: false,
      voltammetryPeakIdx: 0,
    } as any;
    const iter = clickUiTarget(action);

    const { value } = drainSelects(iter, [
      LIST_UI_SWEEP_TYPE.PEAK_ADD,
      { curveIdx: 0 },
      lcmsState,
      LIST_LAYOUT.LC_MS,
    ]);

    expect(value).toEqual(put({
      type: HPLC_MS.UPDATE_HPLCMS_PEAKS,
      payload: {
        spectrumId: 280,
        peaks: [action.payload],
      },
    }));
  });

  it('PEAK_ADD on LCMS without selected wavelength is a no-op', () => {
    const action = {
      type: UI.CLICK_TARGET,
      payload: { x: 5, y: 10 },
      sourceHint: null,
      onPeak: false,
      onPecker: false,
      voltammetryPeakIdx: 0,
    } as any;
    const iter = clickUiTarget(action);

    const { value, done } = drainSelects(iter, [
      LIST_UI_SWEEP_TYPE.PEAK_ADD,
      { curveIdx: 0 },
      { uvvis: { selectedWaveLength: null, currentSpectrum: { peaks: [] } } },
      LIST_LAYOUT.LC_MS,
    ]);
    expect(done).toEqual(true);
    expect(value).toBeUndefined();
  });

  it('PEAK_DELETE on LCMS uses REMOVE_HPLCMS_PEAK for the selected wavelength', () => {
    const action = {
      type: UI.CLICK_TARGET,
      payload: { x: 5, y: 10 },
      sourceHint: null,
      onPeak: true,
      onPecker: false,
      voltammetryPeakIdx: 0,
    } as any;
    const iter = clickUiTarget(action);

    const { value } = drainSelects(iter, [
      LIST_UI_SWEEP_TYPE.PEAK_DELETE,
      { curveIdx: 0 },
      lcmsState,
      LIST_LAYOUT.LC_MS,
    ]);

    expect(value).toEqual(put({
      type: HPLC_MS.REMOVE_HPLCMS_PEAK,
      payload: {
        spectrumId: 280,
        peak: action.payload,
      },
    }));
  });

  it('PEAK_DELETE outside LCMS falls back to EDITPEAK.ADD_NEGATIVE', () => {
    const action = {
      type: UI.CLICK_TARGET,
      payload: { x: 5, y: 10 },
      sourceHint: null,
      onPeak: true,
      onPecker: false,
      voltammetryPeakIdx: 0,
    } as any;
    const iter = clickUiTarget(action);

    const { value } = drainSelects(iter, [
      LIST_UI_SWEEP_TYPE.PEAK_DELETE,
      { curveIdx: 0 },
      { uvvis: {} },
      LIST_LAYOUT.H1,
    ]);

    expect(value).toEqual(put({
      type: EDITPEAK.ADD_NEGATIVE,
      payload: { dataToAdd: action.payload, curveIdx: 0 },
    }));
  });

  it('INTEGRATION_RM on LCMS with selected wavelength removes via HPLC_MS update', () => {
    const action = {
      type: UI.CLICK_TARGET,
      payload: { x: 1, y: 1 },
      sourceHint: null,
      onPeak: true,
      onPecker: false,
      voltammetryPeakIdx: 0,
    } as any;
    const iter = clickUiTarget(action);

    const { value } = drainSelects(iter, [
      LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
      { curveIdx: 0 },
      lcmsState,
      LIST_LAYOUT.LC_MS,
    ]);

    expect(value).toEqual(put({
      type: HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
      payload: {
        spectrumId: 280,
        integration: action.payload,
        remove: true,
      },
    }));
  });

  it('INTEGRATION_RM outside LCMS falls back to INTEGRATION.RM_ONE', () => {
    const action = {
      type: UI.CLICK_TARGET,
      payload: { x: 1, y: 1 },
      sourceHint: null,
      onPeak: true,
      onPecker: false,
      voltammetryPeakIdx: 0,
    } as any;
    const iter = clickUiTarget(action);

    const { value } = drainSelects(iter, [
      LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
      { curveIdx: 0 },
      { uvvis: {} },
      LIST_LAYOUT.H1,
    ]);

    expect(value).toEqual(put({
      type: INTEGRATION.RM_ONE,
      payload: { dataToRemove: action.payload, curveIdx: 0 },
    }));
  });
});

describe('shouldDisplayLcmsSubViewerAt', () => {
  it('matches each whitelisted sweep type when click comes from TIC', () => {
    [
      LIST_UI_SWEEP_TYPE.ZOOMIN,
      LIST_UI_SWEEP_TYPE.ZOOMRESET,
      LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT,
    ].forEach((uiSweepType) => {
      expect(shouldDisplayLcmsSubViewerAt({
        isLcmsLayout: true,
        payload: { x: 1.234, y: 0 },
        sourceHint: 'lcms_tic',
        uiSweepType,
      })).toEqual(true);
    });
  });

  it('rejects when layout is not LCMS', () => {
    expect(shouldDisplayLcmsSubViewerAt({
      isLcmsLayout: false,
      payload: { x: 1.234, y: 0 },
      sourceHint: 'lcms_tic',
      uiSweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
    })).toEqual(false);
  });

  it('rejects when payload x is not finite', () => {
    expect(shouldDisplayLcmsSubViewerAt({
      isLcmsLayout: true,
      payload: { x: null, y: 0 },
      sourceHint: 'lcms_tic',
      uiSweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
    })).toEqual(false);
  });
});
