import { INTEGRATION } from "../../../constants/action_type";
import undoableIntegrationReducer, { integrationReducer } from "../../../reducers/reducer_integration";
import { ActionCreators, newHistory } from "redux-undo";

describe('Test redux reducer for integrations', () => {
  const data = [
    { x: 0, y: 0, k: 0 },
    { x: 2, y: 3, k: 2 },
    { x: 4, y: 4, k: 4 },
    { x: 6, y: 2, k: 6 },
    { x: 8, y: 1, k: 8 },
    { x: 10, y: 0, k: 10 },
  ];

  it('splits one integration into two calculated integrations atomically', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 0, xU: 10, area: 10, absoluteArea: 0 }],
        refArea: 10,
        refFactor: 2,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 10 },
        splitX: 4,
        data,
      },
    });

    expect(newState.integrations[0].stack).toHaveLength(2);
    expect(newState.integrations[0].stack[0]).toMatchObject({ xL: 0, xU: 4, area: 4 });
    expect(newState.integrations[0].stack[1]).toMatchObject({ xL: 4, xU: 10, area: 6 });
    expect(newState.integrations[0].refArea).toEqual(10);
    expect(newState.integrations[0].refFactor).toEqual(2);
  });

  it('keeps shifted stored bounds while calculating with data coordinates', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 1, xU: 11, area: 10, absoluteArea: 0 }],
        refArea: 10,
        refFactor: 1,
        shift: 1,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 1, xU: 11 },
        splitX: 4,
        data,
      },
    });

    expect(newState.integrations[0].stack[0]).toMatchObject({ xL: 1, xU: 5, area: 4 });
    expect(newState.integrations[0].stack[1]).toMatchObject({ xL: 5, xU: 11, area: 6 });
  });

  it('rejects splits that do not leave enough data resolution on both sides', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 0, xU: 10, area: 10, absoluteArea: 0 }],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 10 },
        splitX: 1,
        data,
      },
    });

    expect(newState).toBe(state);
  });

  it('removes an integration whose lower x bound is zero', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 10, area: 10, absoluteArea: 0 },
          { xL: 12, xU: 14, area: 2, absoluteArea: 0 },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.RM_ONE,
      payload: {
        curveIdx: 0,
        dataToRemove: { xL: 0, xU: 10 },
      },
    });

    expect(newState.integrations[0].stack).toEqual([{ xL: 12, xU: 14, area: 2, absoluteArea: 0 }]);
  });

  it('undoes a split in one step', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 0, xU: 10, area: 10, absoluteArea: 0 }],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };
    const splitPresent = integrationReducer(state, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 10 },
        splitX: 4,
        data,
      },
    });
    const splitState: any = newHistory([state], splitPresent, []);
    const undoneState = undoableIntegrationReducer(splitState, ActionCreators.undo());

    expect(splitState.present.integrations[0].stack).toHaveLength(2);
    expect(undoneState.present.integrations[0].stack).toEqual(state.integrations[0].stack);
  });
});
