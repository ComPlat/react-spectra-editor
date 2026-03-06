"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIST_UI_VIEWER_TYPE = exports.LIST_UI_SWEEP_TYPE = exports.LIST_NON_BRUSH_TYPES = void 0;
const LIST_UI_VIEWER_TYPE = exports.LIST_UI_VIEWER_TYPE = {
  SPECTRUM: 'spectrum',
  ANALYSIS: 'analysis'
};
const LIST_UI_SWEEP_TYPE = exports.LIST_UI_SWEEP_TYPE = {
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
  CYCLIC_VOLTA_ADD_MAX_PEAK: 'cyclic voltammetry add max peak',
  CYCLIC_VOLTA_RM_MAX_PEAK: 'cyclic voltammetry remove max peak',
  CYCLIC_VOLTA_ADD_MIN_PEAK: 'cyclic voltammetry add min peak',
  CYCLIC_VOLTA_RM_MIN_PEAK: 'cyclic voltammetry remove min peak',
  CYCLIC_VOLTA_ADD_PECKER: 'cyclic voltammetry add pecker',
  CYCLIC_VOLTA_RM_PECKER: 'cyclic voltammetry remove pecker',
  CYCLIC_VOLTA_SET_REF: 'cyclic voltammetry set ref',
  PEAK_GROUP_SELECT: 'peak group select'
};
const LIST_NON_BRUSH_TYPES = exports.LIST_NON_BRUSH_TYPES = [LIST_UI_SWEEP_TYPE.PEAK_ADD, LIST_UI_SWEEP_TYPE.PEAK_DELETE, LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT, LIST_UI_SWEEP_TYPE.INTEGRATION_RM, LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF, LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD, LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM, LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_CLICK, LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM, LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK, LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK, LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK, LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK, LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER, LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER, LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF, LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT];