import uiReducer from "../../../reducers/reducer_ui";
import { UI } from "../../../constants/action_type";
import { LIST_UI_SWEEP_TYPE } from "../../../constants/list_ui";

describe('Test redux reducer_ui', () => {
  it('keeps only the selected graph in zoom mode', () => {
    const next = uiReducer(undefined, {
      type: UI.SWEEP.SET_TYPE,
      payload: {
        graphIndex: 1,
        sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
      },
    } as any);

    expect(next.zoom.sweepTypes).toEqual([
      LIST_UI_SWEEP_TYPE.ZOOMRESET,
      LIST_UI_SWEEP_TYPE.ZOOMIN,
      LIST_UI_SWEEP_TYPE.ZOOMRESET,
    ]);
    expect(next.sweepType).toEqual(LIST_UI_SWEEP_TYPE.ZOOMIN);
  });

  it('turns off UV/Vis zoom when TIC peak group selection starts', () => {
    const next = uiReducer(undefined, {
      type: UI.SWEEP.SET_TYPE,
      payload: {
        graphIndex: 1,
        sweepType: LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT,
      },
    } as any);

    expect(next.zoom.sweepTypes).toEqual([
      LIST_UI_SWEEP_TYPE.ZOOMRESET,
      LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT,
      LIST_UI_SWEEP_TYPE.ZOOMRESET,
    ]);
    expect(next.sweepType).toEqual(LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT);
  });

  describe('LCMS synced zoom (lcmsSyncX)', () => {
    const xExtent = { xL: 0.5, xU: 1.5 };

    it('mirrors xExtent from graph 0 onto graph 1 when lcmsSyncX = 1', () => {
      const next = uiReducer(undefined, {
        type: UI.SWEEP.SELECT_ZOOMIN,
        payload: {
          graphIndex: 0,
          zoomValue: { xExtent, yExtent: { yL: 0, yU: 1 } },
          lcmsSyncX: 1,
        },
      } as any);

      expect(next.zoom.sweepExtent[0]).toEqual({ xExtent, yExtent: { yL: 0, yU: 1 } });
      expect(next.zoom.sweepExtent[1]).toEqual({ xExtent, yExtent: false });
    });

    it('mirrors xExtent from graph 1 onto graph 0 when lcmsSyncX = 0', () => {
      const next = uiReducer(undefined, {
        type: UI.SWEEP.SELECT_ZOOMIN,
        payload: {
          graphIndex: 1,
          zoomValue: { xExtent, yExtent: { yL: 0, yU: 1 } },
          lcmsSyncX: 0,
        },
      } as any);

      expect(next.zoom.sweepExtent[1]).toEqual({ xExtent, yExtent: { yL: 0, yU: 1 } });
      expect(next.zoom.sweepExtent[0]).toEqual({ xExtent, yExtent: false });
    });

    it('does not touch the other graph when lcmsSyncX is absent', () => {
      const next = uiReducer(undefined, {
        type: UI.SWEEP.SELECT_ZOOMIN,
        payload: {
          graphIndex: 0,
          zoomValue: { xExtent, yExtent: { yL: 0, yU: 1 } },
        },
      } as any);

      expect(next.zoom.sweepExtent[0]).toEqual({ xExtent, yExtent: { yL: 0, yU: 1 } });
      expect(next.zoom.sweepExtent[1]).toEqual({ xExtent: false, yExtent: false });
    });
  });
});
