"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Sizes a d3 chart to the box its root element is laid out in, so the viewBox matches that
// box: with `xMinYMin meet` the chart then fills its pane and never distorts. A fixed
// viewBox does neither once a host stretches the svg to its pane - the drawing is fitted
// to the tighter of the two dimensions and the rest of the pane is left blank.
//
// `width` is taken before the chart is removed (a page scrollbar can come and go with it);
// the height after. A container that keeps a height while empty is bounded by its host (the
// ELN pane, the CV column) and that height is used - which is why the chart's container must
// be the only thing growing into that space: a sibling given a share of it (a flex item next
// to it) takes that share away from the chart for good. One that collapses takes its height
// from the chart, so measuring it would feed back - the old svg plus its inline baseline gap -
// and grow a few px on every resize without end; derive it from the width instead.
class ContainerSize {
  // `getNode` returns the chart's root element (or null before mount); `fallback` is the
  // { width, height } drawn at before anything can be measured, and whose aspect an
  // unbounded container keeps; `onResize` is called when the container's box changes.
  constructor(getNode, fallback, onResize) {
    this.getNode = getNode;
    this.fallback = fallback;
    this.onResize = onResize;
    this.current = null;
    this.isHeightBounded = false;
    this.observer = null;
    this.frame = null;
    this.schedule = this.schedule.bind(this);
  }

  // Call before the chart is removed.
  measureWidth() {
    const node = this.getNode();
    return node ? node.clientWidth : 0;
  }

  // Call after the chart is removed; the size to draw at, remembered for hasChanged.
  target(width) {
    const node = this.getNode();
    const boundedHeight = node ? node.clientHeight : 0;
    this.isHeightBounded = boundedHeight > 0;
    const {
      width: fbWidth,
      height: fbHeight
    } = this.fallback;
    this.current = width ? {
      width,
      height: this.isHeightBounded ? boundedHeight : Math.round(width * fbHeight / fbWidth)
    } : {
      width: fbWidth,
      height: fbHeight
    };
    return this.current;
  }

  // Whether the container's box no longer matches the size last drawn at.
  hasChanged() {
    const node = this.getNode();
    if (!node || !this.current) return false;
    const {
      clientWidth,
      clientHeight
    } = node;
    if (!clientWidth) return false;
    // An unbounded container's height is the chart's own, so it is not an input.
    return clientWidth !== this.current.width || this.isHeightBounded && clientHeight !== this.current.height;
  }
  observe() {
    if (typeof ResizeObserver === 'undefined') return;
    const node = this.getNode();
    if (!node || this.observer) return;
    this.observer = new ResizeObserver(this.schedule);
    this.observer.observe(node);
  }

  // A bounded container's size does not depend on the chart, so redraw at once, before
  // the next paint. An unbounded one does: remounting inside the observer callback resizes
  // what it observes in the same frame, which the browser reports as a "ResizeObserver
  // loop" error - wait for the next frame instead.
  schedule() {
    if (this.isHeightBounded) {
      this.onResize();
      return;
    }
    if (this.frame) return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = null;
      this.onResize();
    });
  }
  disconnect() {
    if (this.frame) {
      window.cancelAnimationFrame(this.frame);
      this.frame = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
var _default = exports.default = ContainerSize;