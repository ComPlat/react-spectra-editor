const LIST_ROOT_SVG_GRAPH = {
  LINE: 'd3Line',
  RECT: 'd3Rect',
  MULTI: 'd3Multi',
};

const LIST_BRUSH_SVG_GRAPH = {
  LINE: 'd3Svg',
  RECT: 'd3SvgRect',
  MULTI: 'd3SvgMulti',
};

// Stable, non-JSS class names a host application (chemotion_ELN) styles against. The
// classes withStyles generates around these nodes are opaque (`jss8 jss4`) and change
// between builds, so a host stylesheet has nothing else to target. Treat these as part
// of the public DOM contract: do not rename them without a host-side change.
//
// All entries are `rse-` prefixed. These land in a host's global, non-modular stylesheet
// alongside its own classes, so an unprefixed generic name like `lcms-stack` would be one
// collision away from a host's own LC/MS markup - and the contract above makes such a name
// expensive to change afterwards.
//
// EDITOR_ROOT is the oldest of these and the one hosts already target; it is listed here
// so it is covered by the same contract as the rest, rather than living on as a bare
// string literal in four components.
const LIST_HOST_HOOK_CLASS = {
  EDITOR_ROOT: 'react-spectrum-editor',
  CMD_BAR: 'rse-cmd-bar',
  LCMS_STACK: 'rse-lcms-stack',
  LCMS_GRAPH_PANEL: 'rse-lcms-graph-panel',
};

export {
  LIST_ROOT_SVG_GRAPH, LIST_BRUSH_SVG_GRAPH, LIST_HOST_HOOK_CLASS,
};
