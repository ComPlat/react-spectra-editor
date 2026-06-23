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

  it('undoes the very first integration added after a fresh load', () => {
    const freshPresent = {
      selectedIdx: 0,
      integrations: [{
        stack: [],
        refArea: 1,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };
    const fresh: any = newHistory([], freshPresent, []);

    const afterAdd = undoableIntegrationReducer(fresh, {
      type: 'UI_SWEEP_SELECT_INTEGRATION',
      payload: {
        curveIdx: 0,
        newData: { xExtent: { xL: 2, xU: 8 }, data },
      },
    });

    expect(afterAdd.past).toHaveLength(1);
    expect(afterAdd.present.integrations[0].stack).toHaveLength(1);

    const undone = undoableIntegrationReducer(afterAdd, ActionCreators.undo());
    expect(undone.present.integrations[0].stack).toHaveLength(0);

    const redone = undoableIntegrationReducer(undone, ActionCreators.redo());
    expect(redone.present.integrations[0].stack).toHaveLength(1);
  });

  it('records a split in the undoable history when dispatched through the undoable reducer', () => {
    const seed: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 0, xU: 10, area: 10, absoluteArea: 0 }],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };
    const seedHistory: any = newHistory([], seed, []);

    const afterSplit = undoableIntegrationReducer(seedHistory, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 10 },
        splitX: 4,
        data,
      },
    });

    expect(afterSplit.past).toHaveLength(1);
    expect(afterSplit.present.integrations[0].stack).toHaveLength(2);

    const undone = undoableIntegrationReducer(afterSplit, ActionCreators.undo());
    expect(undone.present.integrations[0].stack).toEqual(seed.integrations[0].stack);

    const redone = undoableIntegrationReducer(undone, ActionCreators.redo());
    expect(redone.present.integrations[0].stack).toEqual(afterSplit.present.integrations[0].stack);
  });

  it('adds a visual split line by splitting the target into two grouped stack items', () => {
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
      type: INTEGRATION.ADD_VISUAL_SPLIT,
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
    const groupId = newState.integrations[0].stack[0].visualSplitGroupId;
    expect(typeof groupId).toBe('string');
    expect(newState.integrations[0].stack[1].visualSplitGroupId).toBe(groupId);
  });

  it('stores shifted visual split bounds consistently with the integration stack item', () => {
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
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 1, xU: 11 },
        splitX: 4,
        data,
      },
    });

    expect(newState.integrations[0].stack[0]).toMatchObject({ xL: 1, xU: 5 });
    expect(newState.integrations[0].stack[1]).toMatchObject({ xL: 5, xU: 11 });
    expect(newState.integrations[0].stack[0].visualSplitGroupId)
      .toBe(newState.integrations[0].stack[1].visualSplitGroupId);
  });

  it('rejects splitting a child item that already belongs to a visual split group', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 6, area: 6, absoluteArea: 0, visualSplitGroupId: 'g1' },
          { xL: 6, xU: 10, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 6 },
        splitX: 4,
        data,
      },
    });

    expect(newState).toBe(state);
  });

  it('rejects a second visual split on a previously split integration restored from storage', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'persisted-vsg' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 0, visualSplitGroupId: 'persisted-vsg' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 4, xU: 10 },
        splitX: 6,
        data,
      },
    });

    expect(newState).toBe(state);
  });

  it('preserves the original stored area when visually splitting a JCAMP-loaded integration', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 0, xU: 10, area: 300, absoluteArea: 60 }],
        refArea: 300,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 10 },
        splitX: 4,
        data,
      },
    });

    const [leftChild, rightChild] = newState.integrations[0].stack;
    expect(leftChild.area + rightChild.area).toBeCloseTo(300, 9);
    expect(leftChild.absoluteArea + rightChild.absoluteArea).toBeCloseTo(60, 9);
    expect(leftChild.area).toBeGreaterThan(0);
    expect(rightChild.area).toBeGreaterThan(0);
  });

  it('recomputes each side from raw data on a regular split (independent integrations)', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 0, xU: 10, area: 300, absoluteArea: 60 }],
        refArea: 300,
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
        splitX: 4,
        data,
      },
    });

    const [leftChild, rightChild] = newState.integrations[0].stack;
    expect(leftChild).toMatchObject({ xL: 0, xU: 4, area: 4 });
    expect(rightChild).toMatchObject({ xL: 4, xU: 10, area: 6 });
    expect(leftChild.area + rightChild.area).toBeCloseTo(10, 9);
  });

  it('restores the exact total area when removing a visual split line', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [{ xL: 0, xU: 10, area: 300, absoluteArea: 60 }],
        refArea: 300,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const split = integrationReducer(state, {
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0, target: { xL: 0, xU: 10 }, splitX: 4, data,
      },
    });
    expect(split.integrations[0].stack).toHaveLength(2);

    const merged = integrationReducer(split, {
      type: INTEGRATION.RM_VISUAL_SPLIT,
      payload: { curveIdx: 0, splitX: 4, data },
    });

    expect(merged.integrations[0].stack).toHaveLength(1);
    expect(merged.integrations[0].stack[0].area).toBeCloseTo(300, 9);
    expect(merged.integrations[0].stack[0].absoluteArea).toBeCloseTo(60, 9);
  });

  it('allows visually splitting again after the only split line has been removed', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 0, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const merged = integrationReducer(state, {
      type: INTEGRATION.RM_VISUAL_SPLIT,
      payload: { curveIdx: 0, splitX: 4, data },
    });
    expect(merged.integrations[0].stack).toHaveLength(1);
    expect(merged.integrations[0].stack[0].visualSplitGroupId).toBeUndefined();

    const reSplit = integrationReducer(merged, {
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 10 },
        splitX: 6,
        data,
      },
    });

    expect(reSplit.integrations[0].stack).toHaveLength(2);
    expect(reSplit.integrations[0].stack[0]).toMatchObject({ xL: 0, xU: 6 });
    expect(reSplit.integrations[0].stack[1]).toMatchObject({ xL: 6, xU: 10 });
    const newGroupId = reSplit.integrations[0].stack[0].visualSplitGroupId;
    expect(typeof newGroupId).toBe('string');
    expect(reSplit.integrations[0].stack[1].visualSplitGroupId).toBe(newGroupId);
  });

  it('removes a visual split line by merging the two adjacent grouped items', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 6, area: 2, absoluteArea: 0, visualSplitGroupId: 'g1' },
          { xL: 6, xU: 10, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.RM_VISUAL_SPLIT,
      payload: { curveIdx: 0, splitX: 4, data },
    });

    expect(newState.integrations[0].stack).toHaveLength(2);
    expect(newState.integrations[0].stack[0]).toMatchObject({ xL: 0, xU: 6, visualSplitGroupId: 'g1' });
    expect(newState.integrations[0].stack[1]).toMatchObject({ xL: 6, xU: 10, visualSplitGroupId: 'g1' });
  });

  it('strips the orphan groupId when one child of a visual split group is removed', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 0, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const afterRemove = integrationReducer(state, {
      type: INTEGRATION.RM_ONE,
      payload: { curveIdx: 0, dataToRemove: { xL: 0, xU: 4 } },
    });

    expect(afterRemove.integrations[0].stack).toHaveLength(1);
    expect(afterRemove.integrations[0].stack[0]).toMatchObject({ xL: 4, xU: 10 });
    expect(afterRemove.integrations[0].stack[0].visualSplitGroupId).toBeUndefined();

    const reSplit = integrationReducer(afterRemove, {
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 4, xU: 10 },
        splitX: 6,
        data,
      },
    });
    expect(reSplit.integrations[0].stack).toHaveLength(2);
    const reSplitGroupId = reSplit.integrations[0].stack[0].visualSplitGroupId;
    expect(typeof reSplitGroupId).toBe('string');
    expect(reSplit.integrations[0].stack[1].visualSplitGroupId).toBe(reSplitGroupId);
  });

  it('extracts the outer part of a left visual split child and keeps the inner part in the group', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 40, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 60, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const afterSplit = integrationReducer(state, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 4 },
        splitX: 2,
        data,
      },
    });

    expect(afterSplit.integrations[0].stack).toHaveLength(3);
    const [extracted, kept, sibling] = afterSplit.integrations[0].stack;

    expect(extracted).toMatchObject({ xL: 0, xU: 2 });
    expect(extracted.visualSplitGroupId).toBeUndefined();

    expect(kept).toMatchObject({ xL: 2, xU: 4, visualSplitGroupId: 'g1' });
    expect(sibling).toMatchObject({ xL: 4, xU: 10, visualSplitGroupId: 'g1' });

    expect(extracted.area + kept.area).toBeCloseTo(4);
    expect(extracted.absoluteArea + kept.absoluteArea).toBeCloseTo(40);
  });

  it('extracts the outer part of a right visual split child and keeps the inner part in the group', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 40, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 60, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const afterSplit = integrationReducer(state, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 4, xU: 10 },
        splitX: 8,
        data,
      },
    });

    expect(afterSplit.integrations[0].stack).toHaveLength(3);
    const [sibling, kept, extracted] = afterSplit.integrations[0].stack;

    expect(sibling).toMatchObject({ xL: 0, xU: 4, visualSplitGroupId: 'g1' });
    expect(kept).toMatchObject({ xL: 4, xU: 8, visualSplitGroupId: 'g1' });
    expect(extracted).toMatchObject({ xL: 8, xU: 10 });
    expect(extracted.visualSplitGroupId).toBeUndefined();

    expect(kept.area + extracted.area).toBeCloseTo(6);
    expect(kept.absoluteArea + extracted.absoluteArea).toBeCloseTo(60);
  });

  it('keeps both halves in the group when regular-splitting a middle child', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 2, area: 2, absoluteArea: 20, visualSplitGroupId: 'g1' },
          { xL: 2, xU: 8, area: 6, absoluteArea: 60, visualSplitGroupId: 'g1' },
          { xL: 8, xU: 10, area: 2, absoluteArea: 20, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const afterSplit = integrationReducer(state, {
      type: INTEGRATION.SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 2, xU: 8 },
        splitX: 5,
        data,
      },
    });

    expect(afterSplit.integrations[0].stack).toHaveLength(4);
    expect(afterSplit.integrations[0].stack.every((it: any) => it.visualSplitGroupId === 'g1')).toBe(true);
  });

  it('drops the groupId when removing the last visual split line of a group', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 0, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };

    const newState = integrationReducer(state, {
      type: INTEGRATION.RM_VISUAL_SPLIT,
      payload: { curveIdx: 0, splitX: 4, data },
    });

    expect(newState.integrations[0].stack).toHaveLength(1);
    expect(newState.integrations[0].stack[0]).toMatchObject({ xL: 0, xU: 10 });
    expect(newState.integrations[0].stack[0].visualSplitGroupId).toBeUndefined();
  });

  it('undoes adding a visual split line in one step', () => {
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
      type: INTEGRATION.ADD_VISUAL_SPLIT,
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

  it('undoes extracting a child from a visual split group in one step', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 40, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 60, visualSplitGroupId: 'g1' },
        ],
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
        target: { xL: 0, xU: 4 },
        splitX: 2,
        data,
      },
    });
    const splitState: any = newHistory([state], splitPresent, []);
    const undoneState = undoableIntegrationReducer(splitState, ActionCreators.undo());

    expect(splitState.present.integrations[0].stack).toHaveLength(3);
    expect(splitState.present.integrations[0].stack[0].visualSplitGroupId).toBeUndefined();
    expect(splitState.present.integrations[0].stack[1].visualSplitGroupId).toBe('g1');
    expect(splitState.present.integrations[0].stack[2].visualSplitGroupId).toBe('g1');

    expect(undoneState.present.integrations[0].stack).toEqual(state.integrations[0].stack);
    expect(undoneState.present.integrations[0].stack[0].visualSplitGroupId).toBe('g1');
    expect(undoneState.present.integrations[0].stack[1].visualSplitGroupId).toBe('g1');

    const redoneState = undoableIntegrationReducer(undoneState, ActionCreators.redo());
    expect(redoneState.present.integrations[0].stack).toEqual(splitPresent.integrations[0].stack);
  });

  it('undoes removing a visual split line in one step', () => {
    const state: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [
          { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
          { xL: 4, xU: 10, area: 6, absoluteArea: 0, visualSplitGroupId: 'g1' },
        ],
        refArea: 10,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };
    const removedPresent = integrationReducer(state, {
      type: INTEGRATION.RM_VISUAL_SPLIT,
      payload: { curveIdx: 0, splitX: 4, data },
    });
    const removedState: any = newHistory([state], removedPresent, []);
    const undoneState = undoableIntegrationReducer(removedState, ActionCreators.undo());

    expect(removedState.present.integrations[0].stack).toHaveLength(1);
    expect(undoneState.present.integrations[0].stack).toEqual(state.integrations[0].stack);
  });

  it('preserves visualSplitGroupId metadata when restoring integrations via RESET_ALL_RDC', () => {
    const initial: any = {
      selectedIdx: 0,
      integrations: [{
        stack: [],
        refArea: 1,
        refFactor: 1,
        shift: 0,
        edited: false,
      }],
    };
    const restored = integrationReducer(initial, {
      type: INTEGRATION.RESET_ALL_RDC,
      payload: {
        selectedIdx: 0,
        integrations: [
          {
            stack: [
              { xL: 0, xU: 3, area: 3, absoluteArea: 1, visualSplitGroupId: 'g1' },
              { xL: 3, xU: 10, area: 7, absoluteArea: 4, visualSplitGroupId: 'g1' },
            ],
            refArea: 10,
            refFactor: 1,
            shift: 0,
            edited: false,
          },
        ],
      },
    });

    expect(restored.integrations[0].stack[0]).toMatchObject({
      xL: 0, xU: 3, visualSplitGroupId: 'g1',
    });
    expect(restored.integrations[0].stack[1]).toMatchObject({
      xL: 3, xU: 10, visualSplitGroupId: 'g1',
    });
  });

  it('preserves visualSplitGroupId across multi-curve integrations via RESET_ALL_RDC', () => {
    const initial: any = {
      selectedIdx: 0,
      integrations: [
        { stack: [], refArea: 1, refFactor: 1, shift: 0, edited: false },
        { stack: [], refArea: 1, refFactor: 1, shift: 0, edited: false },
      ],
    };
    const restored = integrationReducer(initial, {
      type: INTEGRATION.RESET_ALL_RDC,
      payload: {
        selectedIdx: 1,
        integrations: [
          {
            stack: [{ xL: 0, xU: 4, area: 4, absoluteArea: 2 }],
            refArea: 4,
            refFactor: 1,
            shift: 0,
            edited: false,
          },
          {
            stack: [
              { xL: 5, xU: 7, area: 2, absoluteArea: 1, visualSplitGroupId: 'g2' },
              { xL: 7, xU: 9, area: 2, absoluteArea: 1, visualSplitGroupId: 'g2' },
            ],
            refArea: 4,
            refFactor: 1,
            shift: 0,
            edited: false,
          },
        ],
      },
    });

    expect(restored.integrations[0].stack[0].visualSplitGroupId).toBeUndefined();
    expect(restored.integrations[1].stack[0].visualSplitGroupId).toBe('g2');
    expect(restored.integrations[1].stack[1].visualSplitGroupId).toBe('g2');
  });

  it('rejects visual split lines too close to an integration edge', () => {
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
      type: INTEGRATION.ADD_VISUAL_SPLIT,
      payload: {
        curveIdx: 0,
        target: { xL: 0, xU: 10 },
        splitX: 0,
        data,
      },
    });

    expect(newState).toBe(state);
  });
});
