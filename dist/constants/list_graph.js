"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIST_ROOT_SVG_GRAPH = exports.LIST_HOST_HOOK_CLASS = exports.LIST_BRUSH_SVG_GRAPH = void 0;
const LIST_ROOT_SVG_GRAPH = exports.LIST_ROOT_SVG_GRAPH = {
  LINE: 'd3Line',
  RECT: 'd3Rect',
  MULTI: 'd3Multi'
};
const LIST_BRUSH_SVG_GRAPH = exports.LIST_BRUSH_SVG_GRAPH = {
  LINE: 'd3Svg',
  RECT: 'd3SvgRect',
  MULTI: 'd3SvgMulti'
};

// Stable, non-JSS class names a host application (chemotion_ELN) styles against. The
// classes withStyles generates around these nodes are opaque (`jss8 jss4`) and change
// between builds, so a host stylesheet has nothing else to target. Treat these as part
// of the public DOM contract: do not rename them without a host-side change.
//
// Why hosts need them: LCMS_STACK marks the one place the editor mounts three sibling
// chart containers (`.d3Line` + `.d3Multi` + `.d3Rect`) rather than a single one, so a
// blanket `.d3Line { height: 100% }` rule triples the stack's height; CMD_BAR marks the
// toolbar row, whose outlined select labels float above their own box and must not be
// clipped by a host `overflow: hidden`.
const LIST_HOST_HOOK_CLASS = exports.LIST_HOST_HOOK_CLASS = {
  CMD_BAR: 'rse-cmd-bar',
  LCMS_STACK: 'lcms-stack',
  LCMS_GRAPH_PANEL: 'lcms-graph-panel'
};