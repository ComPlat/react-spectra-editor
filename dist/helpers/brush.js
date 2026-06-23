"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _compass = require("./compass");
var _integration_draft = require("./integration_draft.js");
var _sweep = require("./sweep.js");
var _list_ui = require("../constants/list_ui");
var _cfg = _interopRequireDefault(require("./cfg"));
/* eslint-disable prefer-object-spread */

// eslint-disable-line import/extensions
// eslint-disable-line import/extensions

const d3 = require('d3');
const wheeled = (focus, event) => {
  const {
    currentExtent,
    scrollUiWheelAct,
    brushClass
  } = focus;
  // WORKAROUND: firefox wheel compatibilty
  const wheelEvent = focus.isFirefox ? -event.deltaY : event.wheelDelta; // eslint-disable-line
  const direction = wheelEvent > 0;
  scrollUiWheelAct(Object.assign({}, currentExtent, {
    direction,
    brushClass
  }));
};
const usesTwoClickIntegAdd = (focus, isUiAddIntgSt) => isUiAddIntgSt && _cfg.default.showIntegSplitTools(focus.layout);
const brushed = (focus, xOnly, event, brushedClass = '.d3Svg') => {
  const {
    selectUiSweepAct,
    data,
    dataPks,
    brush,
    brushX,
    w,
    h,
    scales
  } = focus;
  const selection = event.selection && event.selection.reverse();
  if (!selection) return;
  let xes = [w, 0].map(scales.x.invert).sort((a, b) => a - b);
  let yes = [h, 0].map(scales.y.invert).sort((a, b) => a - b);
  let xExtent = {
    xL: xes[0],
    xU: xes[1]
  };
  let yExtent = {
    yL: yes[0],
    yU: yes[1]
  };
  if (xOnly) {
    if (focus.isUiAddIntgSt) {
      const payload = (0, _sweep.buildSweepPayloadFromXBounds)(focus, scales.x.invert(selection[0]), scales.x.invert(selection[1]));
      selectUiSweepAct(payload);
      if (brushX) {
        focus.svg.selectAll('.brushX').call(brushX.move, null);
      }
      return;
    }
    xes = selection.map(scales.x.invert).sort((a, b) => a - b);
    xExtent = {
      xL: xes[0],
      xU: xes[1]
    };
  } else {
    const [begPt, endPt] = selection;
    xes = [begPt[0], endPt[0]].map(scales.x.invert).sort((a, b) => a - b);
    yes = [begPt[1], endPt[1]].map(scales.y.invert).sort((a, b) => a - b);
    xExtent = {
      xL: xes[0],
      xU: xes[1]
    };
    yExtent = {
      yL: yes[0],
      yU: yes[1]
    };
  }
  selectUiSweepAct({
    xExtent,
    yExtent,
    data,
    dataPks
  });
  let svgSel = null;
  if (focus?.svg && typeof focus.svg.selectAll === 'function') {
    svgSel = focus.svg;
  } else if (typeof brushedClass === 'string') {
    svgSel = d3.select(brushedClass);
  }
  if (svgSel && typeof svgSel.selectAll === 'function' && !svgSel.empty()) {
    const brushSelection = xOnly ? svgSel.selectAll('.brushX') : svgSel.selectAll('.brush');
    if (!brushSelection.empty()) {
      if (xOnly && brushX) {
        brushSelection.call(brushX.move, null);
      } else if (brush) {
        brushSelection.call(brush.move, null);
      }
    }
  }
};
const MountBrush = (focus, isUiAddIntgSt, isUiNoBrushSt, brushedClass = '.d3Svg') => {
  const {
    root,
    svg,
    brush,
    brushX,
    w,
    h,
    uiSt,
    graphIndex
  } = focus;
  Object.assign(focus, {
    isUiAddIntgSt
  });
  const twoClickIntegAdd = usesTwoClickIntegAdd(focus, isUiAddIntgSt);
  const {
    firstIntegrationPoint,
    data,
    jcampIdx
  } = focus;
  const isSameIntegrationDraft = firstIntegrationPoint && firstIntegrationPoint.jcampIdx === jcampIdx && firstIntegrationPoint.dataLength === data.length;
  if (!isUiAddIntgSt || firstIntegrationPoint && !isSameIntegrationDraft) {
    (0, _integration_draft.clearPendingIntegrationDraft)();
    Object.assign(focus, {
      firstIntegrationPoint: null
    });
    (0, _compass.clearIntegrationPreview)(focus);
  }
  if (!root || !svg || typeof svg.selectAll !== 'function') return;
  svg.selectAll('.brush, .brushX').remove();
  const isZoomInSubview = uiSt?.zoom?.sweepTypes?.[graphIndex] === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN;
  const isZoomInGlobal = uiSt?.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN;
  const isIntegrationAdd = uiSt?.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD;
  const isMultiplicitySweepAdd = uiSt?.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD;
  const isZoomIn = isZoomInSubview || isZoomInGlobal;
  if (graphIndex !== undefined && !(graphIndex === 0 && isIntegrationAdd) && !isZoomIn && !isMultiplicitySweepAdd) return;
  const isXAxisOnly = focus?.xOnlyBrush === true;
  const xOnly = isUiAddIntgSt || isXAxisOnly && !isZoomIn;
  const brushedCb = event => brushed(focus, xOnly, event, brushedClass);
  const wheeledCb = event => wheeled(focus, event);
  if (isUiNoBrushSt && !twoClickIntegAdd) {
    const target = isUiAddIntgSt ? brushX : brush;
    target.handleSize(10).extent([[0, 0], [w, h]]).on('end', brushedCb);
    const klass = isUiAddIntgSt ? 'brushX' : 'brush';
    root.append('g').attr('class', klass).on('mousemove', event => (0, _compass.MouseMove)(event, focus)).call(target);
  }
  svg.on('wheel', wheeledCb);
};
var _default = exports.default = MountBrush;