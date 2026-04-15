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
});
