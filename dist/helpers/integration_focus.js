"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleVisualSplitLineClick = exports.handleIntegrationMouseMove = exports.handleIntegrationClick = exports.drawVisualSplitLinesForFocus = exports.drawIntegrationAUC = exports.buildIntegrationGroups = exports.buildIntegrationBarData = exports.bindSplitMouseHandlers = void 0;
var _integration = require("./integration");
var _focus = require("./focus");
var _compass = require("./compass");
var _cfg = _interopRequireDefault(require("./cfg"));
var _integration_split = require("./integration_split");
const d3 = require('d3');
const buildIntegrationGroups = (stack = []) => (0, _integration.getVisualSplitGroups)(stack).map(group => ({
  xL: group.xL,
  xU: group.xU,
  isMerged: group.isMerged,
  groupId: group.groupId,
  target: group.items[0]
}));
exports.buildIntegrationGroups = buildIntegrationGroups;
const buildIntegrationBarData = (layout, stack = []) => {
  const showIntegSplit = _cfg.default.showIntegSplitTools(layout);
  const igGroups = buildIntegrationGroups(stack);
  return {
    showIntegSplit,
    igGroups,
    igBarData: showIntegSplit ? igGroups : stack
  };
};
exports.buildIntegrationBarData = buildIntegrationBarData;
const handleIntegrationMouseMove = (focus, event, data, shift, ignoreRef) => {
  if (!focus.isUiSplitIntgSt && !focus.isUiVisualSplitIntgSt) return;
  if (focus.isUiVisualSplitIntgSt && (0, _integration_split.isAlreadyVisuallySplit)(data)) {
    (0, _integration_split.clearIntegrationSplitPreview)(focus);
    return;
  }
  if (focus.isUiSplitIntgSt && (0, _integration_split.isMergedVisualSplitGroup)(data)) {
    (0, _integration_split.clearIntegrationSplitPreview)(focus);
    return;
  }
  const splitX = (0, _integration_split.getSplitXFromEvent)(event, focus);
  const previewTarget = (0, _integration_split.resolveSplitTarget)(focus, data, splitX) || data;
  (0, _integration_split.drawIntegrationSplitPreview)(focus, previewTarget, splitX, shift, ignoreRef);
};
exports.handleIntegrationMouseMove = handleIntegrationMouseMove;
const handleIntegrationClick = (focus, event, data, fallbackClick) => {
  if (!focus.isUiSplitIntgSt && !focus.isUiVisualSplitIntgSt) {
    if (typeof fallbackClick === 'function') fallbackClick(event, data);
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const splitX = (0, _integration_split.getSplitXFromEvent)(event, focus);
  (0, _integration_split.clearIntegrationSplitPreview)(focus);
  const target = (0, _integration_split.resolveSplitTarget)(focus, data, splitX);
  if (!target) return;
  if (focus.isUiVisualSplitIntgSt) {
    const {
      stack = [],
      shift = 0
    } = focus.integrationSplitTargets || {};
    const existingSplitX = (0, _integration_split.getVisualSplitLineAtX)(focus, stack, splitX, shift);
    if (Number.isFinite(existingSplitX)) {
      if (typeof focus.removeVisualSplitLineAct !== 'function') return;
      focus.removeVisualSplitLineAct({
        curveIdx: focus.jcampIdx,
        splitX: existingSplitX,
        data: focus.data
      });
      return;
    }
    if ((0, _integration_split.isAlreadyVisuallySplit)(target)) return;
    if (typeof focus.addVisualSplitLineAct !== 'function') return;
    focus.addVisualSplitLineAct({
      curveIdx: focus.jcampIdx,
      target,
      splitX,
      data: focus.data
    });
    return;
  }
  if ((0, _integration_split.isMergedVisualSplitGroup)(data)) return;
  if (typeof focus.splitIntegrationAct !== 'function') return;
  focus.splitIntegrationAct({
    curveIdx: focus.jcampIdx,
    target,
    splitX,
    data: focus.data
  });
};
exports.handleIntegrationClick = handleIntegrationClick;
const handleVisualSplitLineClick = (focus, event, splitX) => {
  event.stopPropagation();
  event.preventDefault();
  (0, _integration_split.clearIntegrationSplitPreview)(focus);
  if (typeof focus.removeVisualSplitLineAct !== 'function') return;
  focus.removeVisualSplitLineAct({
    curveIdx: focus.jcampIdx,
    splitX,
    data: focus.data
  });
};
exports.handleVisualSplitLineClick = handleVisualSplitLineClick;
const drawVisualSplitLinesForFocus = (focus, stack, shift, ignoreRef) => {
  (0, _integration_split.drawIntegrationVisualSplitLines)(focus, stack, shift, ignoreRef, focus.isUiVisualSplitIntgSt, (event, splitX) => handleVisualSplitLineClick(focus, event, splitX));
};
exports.drawVisualSplitLinesForFocus = drawVisualSplitLinesForFocus;
const drawIntegrationAUC = (focus, stack, shift = 0) => {
  const {
    xt,
    yt
  } = (0, _compass.TfRescale)(focus);
  const groups = buildIntegrationGroups(stack);
  const auc = focus.tags.aucPath.selectAll('path').data(groups);
  auc.exit().attr('class', 'exit').remove();
  const integCurve = border => {
    const {
      xL,
      xU
    } = border;
    const ps = (0, _integration.getIntegrationPoints)(xL - shift, xU - shift, focus.data);
    if (!ps[0]) return null;
    const baselineY = (0, _integration.getLinearBaseline)(ps);
    return d3.area().x(d => xt(d.x)).y0(d => yt(baselineY(d))).y1(d => yt(d.y))(ps);
  };
  const showIntegSplit = _cfg.default.showIntegSplitTools(focus.layout);
  auc.enter().append('path').attr('class', 'auc').attr('fill', 'red').attr('stroke', 'none').attr('fill-opacity', 0.2).attr('stroke-width', 2).merge(auc).attr('d', d => integCurve(d)).attr('id', d => `auc${(0, _focus.itgIdTag)(d)}`).on('mouseover', (event, d) => {
    d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'blue');
    d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).style('fill', 'blue');
  }).on('mouseout', (event, d) => {
    d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).attr('stroke', 'none');
    d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).style('fill', 'red');
    d3.select(`#auc${(0, _focus.itgIdTag)(d)}`).style('fill-opacity', 0.2);
    if (showIntegSplit) (0, _integration_split.clearIntegrationSplitPreview)(focus);
  }).on('mousemove', showIntegSplit ? (event, d) => handleIntegrationMouseMove(focus, event, d, shift, true) : null).on('click', (event, d) => handleIntegrationClick(focus, event, d, (clickEvent, clickData) => focus.onClickTarget(clickEvent, clickData)));
};
exports.drawIntegrationAUC = drawIntegrationAUC;
const bindSplitMouseHandlers = ({
  focus,
  shift,
  ignoreRef,
  showIntegSplit,
  fallbackClick
}) => ({
  mouseout: (event, d) => {
    d3.select(`#igbp${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
    d3.select(`#igbc${(0, _focus.itgIdTag)(d)}`).attr('stroke', '#228B22');
    d3.select(`#igtp${(0, _focus.itgIdTag)(d)}`).style('fill', '#228B22');
    if (showIntegSplit) (0, _integration_split.clearIntegrationSplitPreview)(focus);
  },
  mousemove: showIntegSplit ? (event, d) => handleIntegrationMouseMove(focus, event, d, shift, ignoreRef) : null,
  click: (event, d) => handleIntegrationClick(focus, event, d, fallbackClick)
});
exports.bindSplitMouseHandlers = bindSplitMouseHandlers;