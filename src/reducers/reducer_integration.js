/* eslint-disable prefer-object-spread, default-param-last */
import undoable from 'redux-undo';
import {
  UI, INTEGRATION, EDITPEAK, MANAGER,
} from '../constants/action_type';
import {
  generateVisualSplitGroupId,
  getAbsoluteArea,
  getArea,
  splitAreaProportionally,
} from '../helpers/integration';
import { undoRedoConfig, undoRedoActions } from './undo_redo_config';

const initialState = {
  selectedIdx: 0,
  integrations: [
    {
      stack: [],
      refArea: 1,
      refFactor: 1,
      shift: 0,
      edited: false,
    },
  ],
};

const defaultEmptyIntegration = {
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false,
};

const addToStack = (state, action) => {
  const { newData, curveIdx } = action.payload;

  const { integrations } = state;
  let selectedIntegration = integrations[curveIdx];
  if (selectedIntegration === false || selectedIntegration === undefined) {
    selectedIntegration = defaultEmptyIntegration;
  }

  const { stack, refArea, shift } = selectedIntegration;
  const { xExtent, data } = newData;
  const { xL, xU } = xExtent;
  if (!Number.isFinite(xL) || !Number.isFinite(xU) || (xU - xL) === 0) { return state; }

  const area = getArea(xL, xU, data);
  const defaultRefArea = stack.length === 0 ? area : refArea;
  const absoluteArea = getAbsoluteArea(xL, xU, data); // area depends on y baseline
  const newStack = [...stack,
    {
      xL: xL + shift, xU: xU + shift, area, absoluteArea,
    },
  ];

  const newIntegration = Object.assign(
    {},
    selectedIntegration,
    { stack: newStack, refArea: defaultRefArea },
  );
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const dropOrphanVisualSplitGroupIds = (stack) => {
  const groupCounts = stack.reduce((acc, item) => {
    const groupId = item && item.visualSplitGroupId;
    if (groupId) acc[groupId] = (acc[groupId] || 0) + 1;
    return acc;
  }, {});
  return stack.map((item) => {
    const groupId = item && item.visualSplitGroupId;
    if (!groupId || groupCounts[groupId] > 1) return item;
    const { visualSplitGroupId, ...rest } = item;
    return rest;
  });
};

const rmFromStack = (state, action) => {
  const { dataToRemove, curveIdx } = action.payload;
  const { xL, xU, xExtent } = dataToRemove;

  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];

  const { stack } = selectedIntegration;

  let [txL, txU] = [0, 0];
  if (Number.isFinite(xL) && Number.isFinite(xU)) {
    [txL, txU] = [xL, xU];
  } else if (xExtent) {
    [txL, txU] = [xExtent.xL, xExtent.xU];
  } else {
    return state;
  }
  const filteredStack = stack.filter((k) => k.xL !== txL && k.xU !== txU);
  const newStack = dropOrphanVisualSplitGroupIds(filteredStack);

  const newIntegration = Object.assign({}, selectedIntegration, { stack: newStack });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const hasEnoughDataResolution = (xL, xU, data) => {
  const [lower, upper] = [xL, xU].sort((a, b) => a - b);
  const points = data.filter((pt) => (
    pt
    && Number.isFinite(pt.x)
    && pt.x >= lower
    && pt.x <= upper
  ));
  if (points.length < 2) return false;

  return points.some((pt) => pt.x !== points[0].x);
};

const computeProportionalSplitAreas = (xL, splitX, xU, data, original) => {
  const areaParts = splitAreaProportionally(
    original.area,
    getArea(xL, splitX, data),
    getArea(splitX, xU, data),
  );
  const absParts = splitAreaProportionally(
    original.absoluteArea,
    getAbsoluteArea(xL, splitX, data),
    getAbsoluteArea(splitX, xU, data),
  );
  return {
    leftArea: areaParts.left,
    rightArea: areaParts.right,
    leftAbs: absParts.left,
    rightAbs: absParts.right,
  };
};

const buildSplitStackItem = (xL, xU, shift, area, absoluteArea) => {
  const [lower, upper] = [xL, xU].sort((a, b) => a - b);
  return {
    xL: lower + shift,
    xU: upper + shift,
    area,
    absoluteArea,
  };
};

const getVisualSplitTolerance = (xL, xU) => Math.max(Math.abs(xU - xL) * 1e-6, Number.EPSILON);

const findTargetIntegrationIndex = (stack, target) => stack.findIndex((item) => (
  item.xL === target.xL && item.xU === target.xU
));

const buildVisualSplitItem = (xL, xU, shift, area, absoluteArea, groupId) => {
  const [lower, upper] = [xL, xU].sort((a, b) => a - b);
  const item = {
    xL: lower + shift,
    xU: upper + shift,
    area,
    absoluteArea,
  };
  if (groupId) item.visualSplitGroupId = groupId;
  return item;
};

const isVisuallySplit = (stack, item) => {
  if (!item || !item.visualSplitGroupId) return false;
  return stack.some((other) => (
    other !== item && other.visualSplitGroupId === item.visualSplitGroupId
  ));
};

const buildRawSplitPart = (xL, xU, shift, data) => buildSplitStackItem(
  xL,
  xU,
  shift,
  getArea(xL, xU, data),
  getAbsoluteArea(xL, xU, data),
);

const findVisualSplitNeighborhood = (stack, original, shift, xL, xU) => {
  const groupId = original && original.visualSplitGroupId;
  if (!groupId) return { hasLeft: false, hasRight: false };

  const tolerance = getVisualSplitTolerance(xL, xU);
  const isGroupSibling = (item) => (
    item !== original && item.visualSplitGroupId === groupId
  );

  return {
    hasLeft: stack.some((item) => (
      isGroupSibling(item) && Math.abs((item.xU - shift) - xL) <= tolerance
    )),
    hasRight: stack.some((item) => (
      isGroupSibling(item) && Math.abs((item.xL - shift) - xU) <= tolerance
    )),
  };
};

const buildSplitParts = (original, xL, splitX, xU, shift, data, stack) => {
  if (!original.visualSplitGroupId) {
    return [
      buildRawSplitPart(xL, splitX, shift, data),
      buildRawSplitPart(splitX, xU, shift, data),
    ];
  }

  const { hasLeft, hasRight } = findVisualSplitNeighborhood(stack, original, shift, xL, xU);
  if (!hasLeft && !hasRight) {
    return [
      buildRawSplitPart(xL, splitX, shift, data),
      buildRawSplitPart(splitX, xU, shift, data),
    ];
  }

  const groupId = original.visualSplitGroupId;
  const {
    leftArea, rightArea, leftAbs, rightAbs,
  } = computeProportionalSplitAreas(xL, splitX, xU, data, original);

  const leftStaysInGroup = hasLeft;
  const rightStaysInGroup = hasRight;

  const leftPart = leftStaysInGroup
    ? buildVisualSplitItem(xL, splitX, shift, leftArea, leftAbs, groupId)
    : buildSplitStackItem(xL, splitX, shift, leftArea, leftAbs);
  const rightPart = rightStaysInGroup
    ? buildVisualSplitItem(splitX, xU, shift, rightArea, rightAbs, groupId)
    : buildSplitStackItem(splitX, xU, shift, rightArea, rightAbs);

  return [leftPart, rightPart];
};

const splitStack = (state, action) => {
  const {
    curveIdx, target, splitX, data,
  } = action.payload;

  if (!Number.isFinite(curveIdx) || !target || !Array.isArray(data)) {
    return state;
  }

  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];
  if (!selectedIntegration || selectedIntegration === false) {
    return state;
  }

  const { stack, shift } = selectedIntegration;
  const targetIndex = findTargetIntegrationIndex(stack, target);
  if (targetIndex < 0 || !Number.isFinite(splitX)) {
    return state;
  }

  const original = stack[targetIndex];
  const [xL, xU] = [original.xL - shift, original.xU - shift].sort((a, b) => a - b);
  if (!Number.isFinite(xL) || !Number.isFinite(xU) || splitX <= xL || splitX >= xU) {
    return state;
  }

  if (!hasEnoughDataResolution(xL, splitX, data) || !hasEnoughDataResolution(splitX, xU, data)) {
    return state;
  }

  const splitParts = buildSplitParts(original, xL, splitX, xU, shift, data, stack);
  const [leftIntegration, rightIntegration] = splitParts;

  const newStack = dropOrphanVisualSplitGroupIds([
    ...stack.slice(0, targetIndex),
    leftIntegration,
    rightIntegration,
    ...stack.slice(targetIndex + 1),
  ]);

  const newIntegration = Object.assign({}, selectedIntegration, { stack: newStack });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const addVisualSplitLine = (state, action) => {
  const {
    curveIdx, target, splitX, data,
  } = action.payload;

  if (!Number.isFinite(curveIdx) || !target || !Number.isFinite(splitX) || !Array.isArray(data)) {
    return state;
  }

  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];
  if (!selectedIntegration || selectedIntegration === false) {
    return state;
  }

  const { stack, shift } = selectedIntegration;
  const targetIndex = findTargetIntegrationIndex(stack, target);
  if (targetIndex < 0) return state;

  const original = stack[targetIndex];

  if (original.visualSplitGroupId || isVisuallySplit(stack, original)) {
    return state;
  }

  const [xL, xU] = [original.xL - shift, original.xU - shift].sort((a, b) => a - b);
  const tolerance = getVisualSplitTolerance(xL, xU);
  if (splitX <= xL + tolerance || splitX >= xU - tolerance) {
    return state;
  }
  if (!hasEnoughDataResolution(xL, splitX, data) || !hasEnoughDataResolution(splitX, xU, data)) {
    return state;
  }

  const groupId = generateVisualSplitGroupId();
  const {
    leftArea, rightArea, leftAbs, rightAbs,
  } = computeProportionalSplitAreas(xL, splitX, xU, data, original);
  const leftItem = buildVisualSplitItem(xL, splitX, shift, leftArea, leftAbs, groupId);
  const rightItem = buildVisualSplitItem(splitX, xU, shift, rightArea, rightAbs, groupId);

  if (leftItem.xL >= leftItem.xU
    || rightItem.xL >= rightItem.xU
    || leftItem.xU !== rightItem.xL) {
    return state;
  }

  const newStack = [
    ...stack.slice(0, targetIndex),
    leftItem,
    rightItem,
    ...stack.slice(targetIndex + 1),
  ];

  const newIntegration = Object.assign({}, selectedIntegration, { stack: newStack });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const removeVisualSplitLine = (state, action) => {
  const {
    curveIdx, splitX, data,
  } = action.payload;

  if (!Number.isFinite(curveIdx) || !Number.isFinite(splitX) || !Array.isArray(data)) {
    return state;
  }

  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];
  if (!selectedIntegration || selectedIntegration === false) {
    return state;
  }

  const { stack, shift } = selectedIntegration;
  if (!Array.isArray(stack) || stack.length < 2) return state;

  const tolerance = getVisualSplitTolerance(
    Math.min(...stack.map((s) => s.xL - shift)),
    Math.max(...stack.map((s) => s.xU - shift)),
  );

  let mergeStartIdx = -1;
  for (let i = 0; i < stack.length - 1; i += 1) {
    const left = stack[i];
    const right = stack[i + 1];
    const gapTolerance = Math.max(tolerance, Math.abs(left.xU - right.xL));
    if (
      left.visualSplitGroupId
      && left.visualSplitGroupId === right.visualSplitGroupId
      && Math.abs((left.xU - shift) - splitX) <= gapTolerance
      && Math.abs((right.xL - shift) - splitX) <= gapTolerance
    ) {
      mergeStartIdx = i;
      break;
    }
  }
  if (mergeStartIdx < 0) return state;

  const leftItem = stack[mergeStartIdx];
  const rightItem = stack[mergeStartIdx + 1];
  const groupId = leftItem.visualSplitGroupId;
  const mergedXL = Math.min(leftItem.xL, rightItem.xL) - shift;
  const mergedXU = Math.max(leftItem.xU, rightItem.xU) - shift;

  const remainingInGroup = stack.filter((item, idx) => (
    idx !== mergeStartIdx && idx !== mergeStartIdx + 1 && item.visualSplitGroupId === groupId
  ));
  const keepGroupId = remainingInGroup.length > 0;
  const mergedItem = buildVisualSplitItem(
    mergedXL,
    mergedXU,
    shift,
    (leftItem.area || 0) + (rightItem.area || 0),
    (leftItem.absoluteArea || 0) + (rightItem.absoluteArea || 0),
    keepGroupId ? groupId : null,
  );

  const newStack = [
    ...stack.slice(0, mergeStartIdx),
    mergedItem,
    ...stack.slice(mergeStartIdx + 2),
  ];

  const newIntegration = Object.assign({}, selectedIntegration, { stack: newStack });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const setRef = (state, action) => {
  const { refData, curveIdx } = action.payload;

  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];

  const { stack } = selectedIntegration;

  const { xL, xU } = refData;
  const ref = stack.filter((k) => k.xL === xL && k.xU === xU)[0];
  if (!ref) {
    return state;
  }
  const refArea = ref.area;

  const newIntegration = Object.assign({}, selectedIntegration, { refArea });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const setFkr = (state, action) => {
  const { payload } = action;
  const { curveIdx, factor } = payload;
  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];

  const val = parseFloat(factor);
  const refFactor = val < 0.01 ? 0.01 : val;

  const newIntegration = Object.assign({}, selectedIntegration, { refFactor });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration });
};

const setShift = (state, action) => {
  const { selectedIdx, integrations } = state;
  const selectedIntegration = integrations[selectedIdx];

  const shift = action.payload.prevOffset;

  const newIntegration = Object.assign({}, selectedIntegration, { shift });
  const newArrIntegration = [...integrations];
  newArrIntegration[selectedIdx] = newIntegration;
  return Object.assign({}, state, { integrations: newArrIntegration });
};

const resetAll = (state, action) => {
  const newState = action.payload;
  return Object.assign({}, state, newState);
};

const clearAll = (state, action) => {
  const { payload } = action;
  const { curveIdx } = payload;
  const { integrations } = state;

  const newIntegration = Object.assign({}, defaultEmptyIntegration, { edited: true });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const integrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.SWEEP.SELECT_INTEGRATION:
      return addToStack(state, action);
    case INTEGRATION.RM_ONE:
      return rmFromStack(state, action);
    case INTEGRATION.SPLIT:
      return splitStack(state, action);
    case INTEGRATION.ADD_VISUAL_SPLIT:
      return addVisualSplitLine(state, action);
    case INTEGRATION.RM_VISUAL_SPLIT:
      return removeVisualSplitLine(state, action);
    case INTEGRATION.SET_REF:
      return setRef(state, action);
    case INTEGRATION.SET_FKR:
      return setFkr(state, action);
    case INTEGRATION.RESET_ALL_RDC:
      return resetAll(state, action);
    case INTEGRATION.CLEAR_ALL:
      return clearAll(state, action);
    case EDITPEAK.SHIFT:
      return setShift(state, action);
    case MANAGER.RESETALL:
      return state;
    default:
      return undoRedoActions.indexOf(action.type) >= 0
        ? Object.assign({}, state)
        : state;
  }
};

const undoableIntegrationReducer = undoable(
  integrationReducer,
  undoRedoConfig,
);

export { integrationReducer };

export default undoableIntegrationReducer;
