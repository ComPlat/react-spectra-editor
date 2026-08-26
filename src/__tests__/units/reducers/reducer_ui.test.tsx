import uiReducer from "../../../reducers/reducer_ui";
import { UI } from "../../../constants/action_type";
import { LIST_UI_SWEEP_TYPE } from "../../../constants/list_ui";
import { seedLcmsUnionExtent } from "../../../actions/ui";

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

    // Review finding S4: the LC-MS union domain (computed once by
    // ViewerLineRect.maybeSeedUnionXExtent from the TIC/UVVIS data) must reuse
    // this exact same lcmsSyncX mirroring, so both panes end up on the
    // identical xExtent rather than a second, parallel sync mechanism.
    it('seedLcmsUnionExtent puts both graphs on the identical xExtent', () => {
      const unionXExtent = { xL: 1.12, xU: 19.96 };
      const next = uiReducer(undefined, seedLcmsUnionExtent(unionXExtent) as any);

      expect(next.zoom.sweepExtent[0]).toEqual({ xExtent: unionXExtent, yExtent: false });
      expect(next.zoom.sweepExtent[1]).toEqual({ xExtent: unionXExtent, yExtent: false });
      expect(next.zoom.sweepExtent[0]).toEqual(next.zoom.sweepExtent[1]);
    });

    // The seed writes slot 0 without the user having touched that pane, while
    // saga_lcms_ui reads zoom.graphIndex back to decide which pane the next
    // brush belongs to. Moving the pointer to 0 here would re-attribute a
    // pending TIC zoom (sweepTypes[1] === ZOOMIN) to the UVVIS pane, and the
    // TIC brush's yExtent would land on the UVVIS domain.
    it('seedLcmsUnionExtent leaves zoom.graphIndex on the pane the user is zooming', () => {
      const zoomingTic = uiReducer(undefined, {
        type: UI.SWEEP.SET_TYPE,
        payload: { graphIndex: 1, sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN },
      } as any);
      expect(zoomingTic.zoom.graphIndex).toEqual(1);

      const next = uiReducer(zoomingTic, seedLcmsUnionExtent({ xL: 1.12, xU: 19.96 }) as any);

      expect(next.zoom.graphIndex).toEqual(1);
      expect(next.zoom.sweepTypes[1]).toEqual(LIST_UI_SWEEP_TYPE.ZOOMIN);
    });

    it('a real zoom still moves zoom.graphIndex to the brushed pane', () => {
      const next = uiReducer(undefined, {
        type: UI.SWEEP.SELECT_ZOOMIN,
        payload: {
          graphIndex: 1,
          zoomValue: { xExtent: { xL: 2, xU: 9 }, yExtent: { yL: 0, yU: 1 } },
          lcmsSyncX: 0,
        },
      } as any);

      expect(next.zoom.graphIndex).toEqual(1);
    });
  });
});
