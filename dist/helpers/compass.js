"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TfRescale = exports.MouseMove = exports.MountCompass = exports.ClickCompass = void 0;
var d3 = _interopRequireWildcard(require("d3"));
var _format = _interopRequireDefault(require("./format"));
var _chem = require("./chem");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const TfRescale = focus => {
  const xt = focus.scales.x;
  const yt = focus.scales.y;
  return {
    xt,
    yt
  };
};
exports.TfRescale = TfRescale;
const fetchPt = (event, focus, xt) => {
  // const rawMouseX = focus.isFirefox // WORKAROUND d3.mouse firefox compatibility
  //   ? d3.event.offsetX
  //   : d3.mouse(focus.root.node())[0];
  const rawMouseX = d3.pointer(event, focus.root.node())[0];
  const mouseX = xt.invert(rawMouseX);
  const bisectDate = d3.bisector(d => +d.x).left;
  const dt = focus.data;
  const ls = dt.length;
  const sortData = ls > 0 && dt[0].x > dt[ls - 1].x ? dt.reverse() : dt;
  const idx = bisectDate(sortData, +mouseX);
  return sortData[idx];
};
const fetchFreePt = (event, focus, xt, yt) => {
  // const rawMouseX = focus.isFirefox // WORKAROUND d3.mouse firefox compatibility
  //   ? d3.event.offsetX
  //   : d3.mouse(focus.root.node())[0];
  // const rawMouseY = focus.isFirefox // WORKAROUND d3.mouse firefox compatibility
  //   ? d3.event.offsetY
  //   : d3.mouse(focus.root.node())[1];
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
  dt.forEach(pt => {
    const distance = distance2(pt.x, mouseX, pt.y, mouseY);
    if (minDistance > distance) {
      minDistance = distance;
      selectPoint = pt;
    }
  });
  return selectPoint;
};
const MouseMove = (event, focus) => {
  const {
    xt,
    yt
  } = TfRescale(focus);
  const {
    freq,
    layout,
    wavelength
  } = focus;
  if (_format.default.isCyclicVoltaLayout(layout)) {
    const pt = fetchFreePt(event, focus, xt, yt);
    if (pt) {
      const tx = xt(pt.x);
      const ty = yt(pt.y);
      focus.root.select('.compass').attr('transform', `translate(${tx},${ty})`);
      focus.root.select('.x-hover-line').attr('y1', 0 - ty).attr('y2', focus.h - ty);
      focus.root.select('.cursor-txt').attr('transform', `translate(${tx},${10})`).text(pt.x.toFixed(3));
      if (freq) {
        focus.root.select('.cursor-txt-hz').attr('transform', `translate(${tx},${20})`).text(`${(pt.x * freq).toFixed(3)} Hz`);
      } else {
        focus.root.select('.cursor-txt-hz').text('');
      }
    }
  } else {
    const pt = fetchPt(event, focus, xt);
    if (pt) {
      const tx = xt(pt.x);
      const ty = yt(pt.y);
      focus.root.select('.compass').attr('transform', `translate(${tx},${ty})`);
      focus.root.select('.x-hover-line').attr('y1', 0 - ty).attr('y2', focus.h - ty);
      if (_format.default.isXRDLayout(layout)) {
        let dValue = 0.0;
        if (wavelength) {
          dValue = (0, _chem.Convert2DValue)(pt.x, wavelength.value).toExponential(2);
        } else {
          dValue = (0, _chem.Convert2DValue)(pt.x).toExponential(2);
        }
        focus.root.select('.cursor-txt-hz').attr('transform', `translate(${tx},${ty - 30})`).text(`2Theta: ${pt.x.toExponential(2)}, d-value: ${dValue}`);
      } else if (_format.default.isTGALayout(layout)) {
        focus.root.select('.cursor-txt').attr('transform', `translate(${tx},${10})`).text(`X: ${pt.x.toFixed(3)}, Y: ${pt.y.toFixed(3)}`);
      } else {
        focus.root.select('.cursor-txt').attr('transform', `translate(${tx},${10})`).text(pt.x.toFixed(3));
        if (freq) {
          focus.root.select('.cursor-txt-hz').attr('transform', `translate(${tx},${20})`).text(`${(pt.x * freq).toFixed(3)} Hz`);
        } else {
          focus.root.select('.cursor-txt-hz').text('');
        }
      }
    }
  }
};
exports.MouseMove = MouseMove;
const ClickCompass = (event, focus) => {
  event.stopPropagation();
  event.preventDefault();
  const {
    xt,
    yt
  } = TfRescale(focus);
  let pt = fetchPt(event, focus, xt);
  const {
    layout,
    cyclicvoltaSt,
    jcampIdx
  } = focus;
  if (_format.default.isCyclicVoltaLayout(layout)) {
    pt = fetchFreePt(event, focus, xt, yt);
    const onPeak = false;
    if (cyclicvoltaSt) {
      const {
        spectraList
      } = cyclicvoltaSt;
      const spectra = spectraList[jcampIdx];
      const voltammetryPeakIdx = spectra.selectedIdx;
      focus.clickUiTargetAct(pt, onPeak, voltammetryPeakIdx, jcampIdx);
    } else {
      focus.clickUiTargetAct(pt, onPeak);
    }
  } else {
    focus.clickUiTargetAct(pt, false);
  }
};
exports.ClickCompass = ClickCompass;
const MountCompass = focus => {
  const {
    root,
    w,
    h
  } = focus;
  const compass = root.append('g').attr('class', 'compass');
  const cursor = root.append('g').attr('class', 'cursor');
  const overlay = root.append('rect').attr('class', 'overlay-focus').attr('width', w).attr('height', h).attr('opacity', 0.0);
  compass.append('line').attr('class', 'x-hover-line hover-line').attr('stroke', '#777').attr('stroke-width', 1).attr('stroke-dasharray', 2, 2);
  compass.append('circle').attr('r', 4).attr('fill', 'none').attr('stroke', '#777').attr('stroke-width', 2);
  cursor.append('text').attr('class', 'cursor-txt').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle');
  cursor.append('text').attr('class', 'cursor-txt-hz').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle').style('fill', '#D68910');
  overlay.on('mousemove', event => MouseMove(event, focus)).on('click', event => ClickCompass(event, focus));
};
exports.MountCompass = MountCompass;