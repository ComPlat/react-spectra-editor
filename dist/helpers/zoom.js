'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var resetZoom = function resetZoom(main) {
  main.svg.call(main.zoom.transform, d3.zoomIdentity);
  main.svg.selectAll('.brush').call(main.brush.move, null);
};

var MountZoom = function MountZoom(main, zoomed) {
  var zoomedCb = function zoomedCb() {
    return zoomed(main);
  };
  var resetZoomCb = function resetZoomCb() {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    resetZoom(main);
  };

  main.zoom.on('zoom', zoomedCb);
  main.svg.call(main.zoom).on('contextmenu.zoom', resetZoomCb);
};

exports.default = MountZoom;