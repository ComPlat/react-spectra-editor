"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var d3 = _interopRequireWildcard(require("d3"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const resetZoom = main => {
  main.svg.call(main.zoom.transform, d3.zoomIdentity);
  main.svg.selectAll('.brush').call(main.brush.move, null);
};
const MountZoom = (main, zoomed) => {
  const zoomedCb = event => zoomed(event, main);
  const resetZoomCb = event => {
    event.stopPropagation();
    event.preventDefault();
    resetZoom(main);
  };
  main.zoom.on('zoom', zoomedCb);
  main.svg.call(main.zoom).on('contextmenu.zoom', resetZoomCb);
};
var _default = exports.default = MountZoom;