const LIST_UI_VIEWER_TYPE = {
  SPECTRUM: 'spectrum',
  ANALYSIS: 'analysis',
};

const LIST_UI_SWEEP_TYPE = {
  ZOOMIN: 'zoom in',
  ZOOMRESET: 'zoom reset',
  INTEGRATION_ADD: 'integration add',
  INTEGRATION_RM: 'integration remove',
  INTEGRATION_REF: 'integration reference',
  INTEGRATION_SET_REF: 'integration set ref',
  MULTIPLICITY_SWEEP_ADD: 'multiplicity sweep add',
  MULTIPLICITY_ONE_CLICK: 'multiplicity one click',
  MULTIPLICITY_ONE_RM: 'multiplicity one remove',
  MULTIPLICITY_PEAK_ADD: 'multiplicity peak add',
  MULTIPLICITY_PEAK_RM: 'multiplicity peak remove',
  MULTIPLICITY_ALL_CLEAR: 'multiplicity all clear',
  PEAK_ADD: 'peak add',
  PEAK_DELETE: 'peak delete',
  ANCHOR_SHIFT: 'anchor shift',
};

const LIST_NON_BRUSH_TYPES = [
  LIST_UI_SWEEP_TYPE.PEAK_ADD,
  LIST_UI_SWEEP_TYPE.PEAK_DELETE,
  LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT,
  LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
  LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_CLICK,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM,
];

export {
  LIST_UI_VIEWER_TYPE, LIST_UI_SWEEP_TYPE, LIST_NON_BRUSH_TYPES,
};
