import Format from './format';
import { Convert2DValue } from './chem';
import { LIST_UI_SWEEP_TYPE } from '../constants/list_ui';
import Cfg from './cfg';
import { buildSweepPayloadFromXBounds } from './sweep.js'; // eslint-disable-line import/extensions
import {
  forgetPendingIntegrationDraft,
  setPendingIntegrationDraft,
} from './integration_draft.js'; // eslint-disable-line import/extensions
import {
  clearIntegrationSplitPreview,
  drawIntegrationSplitPreview,
  getIntegrationSplitTargetFromEvent,
  getVisualSplitLineAtX,
  isAlreadyVisuallySplit,
} from './integration_split';

const d3 = require('d3');

const TfRescale = (focus) => {
  const xt = focus.scales.x;
  const yt = focus.scales.y;
  return { xt, yt };
};

const fetchPt = (event, focus, xt) => {
  const rawMouseX = d3.pointer(event, focus.root.node())[0];
  const mouseX = xt.invert(rawMouseX);
  const bisectDate = d3.bisector((d) => +d.x).left;
  const dt = focus.data;
  const ls = dt.length;
  const sortData = ls > 0 && dt[0].x > dt[ls - 1].x ? [...dt].reverse() : dt;
  const idx = bisectDate(sortData, +mouseX);
  return sortData[Math.min(idx, ls - 1)];
};

const fetchFreePt = (event, focus, xt, yt) => {
  const rawMouseX = d3.pointer(event, focus.root.node())[0];
  const rawMouseY = d3.pointer(event, focus.root.node())[1];
  const mouseX = xt.invert(rawMouseX);
  const mouseY = yt.invert(rawMouseY);

  const distance2 = (x1, x2, y1, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
  };

  let minDistance = Number.MAX_VALUE;

  const dt = focus.data;
  let selectPoint = null;
  dt.forEach((pt) => {
    const distance = distance2(pt.x, mouseX, pt.y, mouseY);
    if (minDistance > distance) {
      minDistance = distance;
      selectPoint = pt;
    }
  });
  return selectPoint;
};

const clearIntegrationPreview = (focus) => {
  if (!focus || !focus.root) return;
  focus.root.select('.integration-preview-line').remove();
};

const drawIntegrationPreview = (focus, firstPoint, nextPoint) => {
  if (!firstPoint || !nextPoint) return;
  const { xt, yt } = TfRescale(focus);
  const preview = focus.root.select('.integration-preview');
  const line = preview.selectAll('.integration-preview-line').data([{
    firstPoint,
    nextPoint,
  }]);

  line.enter()
    .append('line')
    .attr('class', 'integration-preview-line')
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '4,3')
    .style('pointer-events', 'none')
    .merge(line)
    .attr('x1', (d) => xt(d.firstPoint.x))
    .attr('y1', (d) => yt(d.firstPoint.y))
    .attr('x2', (d) => xt(d.nextPoint.x))
    .attr('y2', (d) => yt(d.nextPoint.y));
};

const getCurvePointFromEvent = (event, focus) => {
  const { xt, yt } = TfRescale(focus);
  if (Format.isCyclicVoltaLayout(focus.layout)) {
    return fetchFreePt(event, focus, xt, yt);
  }
  return fetchPt(event, focus, xt);
};

const cancelIntegrationDraft = (focus) => {
  Object.assign(focus, { firstIntegrationPoint: null });
  clearIntegrationPreview(focus);
  forgetPendingIntegrationDraft();
};

const updateIntegrationPreview = (event, focus) => {
  if (!focus.isUiAddIntgSt || !focus.firstIntegrationPoint) return;
  if (!Cfg.showIntegSplitTools(focus.layout)) return;
  const pt = getCurvePointFromEvent(event, focus);
  if (!pt) return;
  drawIntegrationPreview(focus, focus.firstIntegrationPoint, pt);
};

const updateIntegrationSplitPreview = (event, focus) => {
  if (!focus.isUiSplitIntgSt && !focus.isUiVisualSplitIntgSt) return;

  const { splitX, target } = getIntegrationSplitTargetFromEvent(event, focus);
  if (!target) {
    clearIntegrationSplitPreview(focus);
    return;
  }

  if (focus.isUiVisualSplitIntgSt && isAlreadyVisuallySplit(target)) {
    clearIntegrationSplitPreview(focus);
    return;
  }

  const { shift = 0, ignoreRef = false } = focus.integrationSplitTargets || {};
  drawIntegrationSplitPreview(focus, target, splitX, shift, ignoreRef);
};

const MouseMove = (event, focus) => {
  const { xt, yt } = TfRescale(focus);
  const { freq, layout, wavelength } = focus;
  if (Format.isCyclicVoltaLayout(layout)) {
    const pt = fetchFreePt(event, focus, xt, yt);
    if (pt) {
      const tx = xt(pt.x);
      const ty = yt(pt.y);
      focus.root.select('.compass').attr('transform', `translate(${tx},${ty})`);
      focus.root.select('.x-hover-line')
        .attr('y1', 0 - ty)
        .attr('y2', focus.h - ty);
      focus.root.select('.cursor-txt')
        .attr('transform', `translate(${tx},${10})`)
        .text(pt.x.toFixed(3));
      if (freq) {
        focus.root.select('.cursor-txt-hz')
          .attr('transform', `translate(${tx},${20})`)
          .text(`${(pt.x * freq).toFixed(3)} Hz`);
      } else {
        focus.root.select('.cursor-txt-hz')
          .text('');
      }
    }
  } else {
    const pt = fetchPt(event, focus, xt);
    if (pt) {
      const tx = xt(pt.x);
      const ty = yt(pt.y);
      focus.root.select('.compass').attr('transform', `translate(${tx},${ty})`);
      focus.root.select('.x-hover-line')
        .attr('y1', 0 - ty)
        .attr('y2', focus.h - ty);
      if (Format.isXRDLayout(layout)) {
        let dValue = 0.0;
        if (wavelength) {
          dValue = Convert2DValue(pt.x, wavelength.value).toExponential(2);
        } else {
          dValue = Convert2DValue(pt.x).toExponential(2);
        }
        focus.root.select('.cursor-txt-hz')
          .attr('transform', `translate(${tx},${ty - 30})`)
          .text(`2Theta: ${pt.x.toExponential(2)}, d-value: ${dValue}`);
      } else if (Format.isTGALayout(layout) || Format.isDSCLayout(layout)) {
        focus.root.select('.cursor-txt')
          .attr('transform', `translate(${tx},${10})`)
          .text(`X: ${pt.x.toFixed(3)}, Y: ${pt.y.toFixed(3)}`);
      } else if (Format.isMsLayout(layout)) {
        const maxY = d3.max(focus.data, (row) => row.y) || 0;
        const relPct = maxY > 0 ? (100 * pt.y) / maxY : 0;
        const rel = maxY > 0 ? parseInt(relPct, 10) : 0;
        const xPrecision = Format.clampDecimalPlaces(focus.decimal);
        focus.root.select('.cursor-txt')
          .attr('transform', `translate(${tx},${10})`)
          .text(`${pt.x.toFixed(xPrecision)} (${rel})`);
        focus.root.select('.cursor-txt-hz')
          .text('');
      } else {
        focus.root.select('.cursor-txt')
          .attr('transform', `translate(${tx},${10})`)
          .text(pt.x.toFixed(3));
        if (freq) {
          focus.root.select('.cursor-txt-hz')
            .attr('transform', `translate(${tx},${20})`)
            .text(`${(pt.x * freq).toFixed(3)} Hz`);
        } else {
          focus.root.select('.cursor-txt-hz')
            .text('');
        }
      }
    }
  }
  updateIntegrationPreview(event, focus);
  updateIntegrationSplitPreview(event, focus);
};

const clickIntegrationPoint = (event, focus) => {
  const pt = getCurvePointFromEvent(event, focus);
  if (!pt) return;

  const { firstIntegrationPoint, selectUiSweepAct } = focus;
  if (!firstIntegrationPoint) {
    // Keep the draft local to D3; the second click emits the existing sweep payload.
    const draftPoint = {
      x: pt.x,
      y: pt.y,
      jcampIdx: focus.jcampIdx,
      dataLength: focus.data.length,
    };
    Object.assign(focus, { firstIntegrationPoint: draftPoint });
    setPendingIntegrationDraft({
      jcampIdx: focus.jcampIdx,
      dataLength: focus.data.length,
      cancel: () => cancelIntegrationDraft(focus),
    });
    drawIntegrationPreview(focus, draftPoint, draftPoint);
    return;
  }

  cancelIntegrationDraft(focus);
  if (firstIntegrationPoint.x === pt.x) {
    return;
  }

  selectUiSweepAct(buildSweepPayloadFromXBounds(
    focus,
    firstIntegrationPoint.x,
    pt.x,
  ));
};

const ClickCompass = (event, focus) => {
  event.stopPropagation();
  event.preventDefault();
  if (focus.isUiAddIntgSt && Cfg.showIntegSplitTools(focus.layout)) {
    clickIntegrationPoint(event, focus);
    return;
  }
  if (focus.isUiSplitIntgSt) {
    const { splitX, target } = getIntegrationSplitTargetFromEvent(event, focus);
    if (!target) return;

    clearIntegrationSplitPreview(focus);
    focus.splitIntegrationAct({
      curveIdx: focus.jcampIdx,
      target,
      splitX,
      data: focus.data,
    });
    return;
  }
  if (focus.isUiVisualSplitIntgSt) {
    const { splitX, target } = getIntegrationSplitTargetFromEvent(event, focus);
    if (!target) return;

    const { stack = [], shift = 0 } = focus.integrationSplitTargets || {};
    const existingSplitX = getVisualSplitLineAtX(focus, stack, splitX, shift);
    clearIntegrationSplitPreview(focus);
    if (Number.isFinite(existingSplitX)) {
      if (typeof focus.removeVisualSplitLineAct !== 'function') return;
      focus.removeVisualSplitLineAct({
        curveIdx: focus.jcampIdx,
        splitX: existingSplitX,
        data: focus.data,
      });
      return;
    }
    if (isAlreadyVisuallySplit(target)) return;
    if (typeof focus.addVisualSplitLineAct !== 'function') return;
    focus.addVisualSplitLineAct({
      curveIdx: focus.jcampIdx,
      target,
      splitX,
      data: focus.data,
    });
    return;
  }

  const { layout, cyclicvoltaSt, jcampIdx } = focus;
  const isPeakGroupSelect = focus.uiSt?.sweepType === LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT;
  const isMsGraph = focus.graphIndex === 2;
  const isUvvisGraph = focus.graphIndex === 0;
  const isLcmsTicGraph = Format.isLCMsLayout(layout) && focus.graphIndex === 1;
  if (isPeakGroupSelect && isMsGraph) return;
  if (isPeakGroupSelect && Format.isLCMsLayout(layout) && isUvvisGraph) return;

  const { xt, yt } = TfRescale(focus);
  let pt = fetchPt(event, focus, xt);
  if (Format.isCyclicVoltaLayout(layout)) {
    pt = fetchFreePt(event, focus, xt, yt);
    const onPeak = false;
    if (cyclicvoltaSt) {
      const { spectraList } = cyclicvoltaSt;
      const spectra = spectraList[jcampIdx];
      const voltammetryPeakIdx = spectra.selectedIdx;
      focus.clickUiTargetAct(pt, onPeak, voltammetryPeakIdx, jcampIdx);
    } else {
      focus.clickUiTargetAct(pt, onPeak);
    }
  } else if (isLcmsTicGraph) {
    focus.clickUiTargetAct(pt, false, false, jcampIdx, false, 'lcms_tic');
  } else {
    focus.clickUiTargetAct(pt, false, 0, focus.jcampIdx);
  }
};

const MountCompass = (focus) => {
  const { root, w, h } = focus;
  const compass = root.append('g')
    .attr('class', 'compass');
  const cursor = root.append('g')
    .attr('class', 'cursor');
  const preview = root.append('g')
    .attr('class', 'integration-preview')
    .attr('clip-path', 'url(#clip)');
  const overlay = root.append('rect')
    .attr('class', 'overlay-focus')
    .attr('width', w)
    .attr('height', h)
    .attr('opacity', 0.0);
  compass.append('line')
    .attr('class', 'x-hover-line hover-line')
    .attr('stroke', '#777')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 2, 2);
  compass.append('circle')
    .attr('r', 4)
    .attr('fill', 'none')
    .attr('stroke', '#777')
    .attr('stroke-width', 2);
  cursor.append('text')
    .attr('class', 'cursor-txt')
    .attr('font-family', 'Helvetica')
    .style('font-size', '12px')
    .style('text-anchor', 'middle');
  cursor.append('text')
    .attr('class', 'cursor-txt-hz')
    .attr('font-family', 'Helvetica')
    .style('font-size', '12px')
    .style('text-anchor', 'middle')
    .style('fill', '#D68910');

  preview.selectAll('*').remove();

  overlay
    .on('mousemove', (event) => MouseMove(event, focus))
    .on('click', (event) => ClickCompass(event, focus));
};

export {
  MountCompass,
  TfRescale,
  ClickCompass,
  MouseMove,
  getCurvePointFromEvent,
  clearIntegrationPreview,
};
