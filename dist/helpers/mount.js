'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MountBars = exports.MountMainFrame = exports.MountClip = exports.MountMarker = exports.MountAxisLabelY = exports.MountAxisLabelX = exports.MountComparePath = exports.MountAxis = exports.MountGrid = exports.MountThresLine = exports.MountPath = exports.MountRef = exports.MountTags = undefined;

var _compass = require('./compass');

var MountTags = function MountTags(target) {
  var igbPath = target.root.append('g').attr('class', 'igbPath-clip').attr('clip-path', 'url(#clip)');
  var igcPath = target.root.append('g').attr('class', 'igcPath-clip').attr('clip-path', 'url(#clip)');
  var igtPath = target.root.append('g').attr('class', 'igtPath-clip').attr('clip-path', 'url(#clip)');
  var pPath = target.root.append('g').attr('class', 'pPath-clip').attr('clip-path', 'url(#clip)');
  var bpPath = target.root.append('g').attr('class', 'bpPath-clip').attr('clip-path', 'url(#clip)');
  var bpTxt = target.root.append('g').attr('class', 'bpTxt-clip').attr('clip-path', 'url(#clip)');
  var mpybPath = target.root.append('g').attr('class', 'mpybPath-clip').attr('clip-path', 'url(#clip)');
  var mpyt1Path = target.root.append('g').attr('class', 'mpyt1Path-clip').attr('clip-path', 'url(#clip)');
  var mpyt2Path = target.root.append('g').attr('class', 'mpyt2Path-clip').attr('clip-path', 'url(#clip)');
  var mpypPath = target.root.append('g').attr('class', 'mpypPath-clip').attr('clip-path', 'url(#clip)');
  var aucPath = target.root.append('g').attr('class', 'aucPath-clip').attr('clip-path', 'url(#clip)');
  var peckerPath = target.root.append('g').attr('class', 'peckerPath-clip').attr('clip-path', 'url(#clip)');
  return {
    pPath: pPath, bpPath: bpPath, bpTxt: bpTxt, igbPath: igbPath, igcPath: igcPath, igtPath: igtPath, mpybPath: mpybPath, mpyt1Path: mpyt1Path, mpyt2Path: mpyt2Path, mpypPath: mpypPath, aucPath: aucPath, peckerPath: peckerPath
  };
};

var MountBars = function MountBars(target) {
  var bars = target.root.append('g').attr('class', 'bars-clip').attr('clip-path', 'url(#clip)');
  return bars;
};

var MountRef = function MountRef(target) {
  var ref = target.root.append('g').attr('class', 'ref-clip').attr('clip-path', 'url(#ref-clip)');
  return ref;
};

var MountPath = function MountPath(target, color) {
  var path = target.root.append('g').attr('class', 'line-clip').attr('clip-path', 'url(#clip)').append('path').attr('class', 'line').style('fill', 'none').style('stroke', color).style('stroke-width', 1).on('click', function () {
    return (0, _compass.ClickCompass)(target);
  });
  return path;
};

var MountComparePath = function MountComparePath(target, color, id) {
  var alpha = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var path = target.root.append('g').attr('class', 'line-clip-compare').attr('id', id).attr('clip-path', 'url(#clip)').append('path').attr('class', 'line').style('fill', 'none').style('stroke', color).style('stroke-opacity', alpha).style('stroke-width', 1).style('stroke-dasharray', '30, 3').on('click', function () {
    return (0, _compass.ClickCompass)(target);
  });
  return path;
};

var MountThresLine = function MountThresLine(target, color) {
  var thresLineUp = target.root.append('g').attr('class', 'line-clip').attr('clip-path', 'url(#clip)').append('path').attr('class', 'thresholdUp').style('stroke-dasharray', '3, 3').style('fill', 'none').style('stroke', color).style('stroke-width', 1);
  var thresLineDw = target.root.append('g').attr('class', 'line-clip').attr('clip-path', 'url(#clip)').append('path').attr('class', 'thresholdDw').style('stroke-dasharray', '3, 3').style('fill', 'none').style('stroke', color).style('stroke-width', 1);
  return [thresLineUp, thresLineDw];
};

var MountGrid = function MountGrid(target) {
  var gridTrans = 'translate(0, ' + target.h + ')';
  var xGrid = target.root.append('g').attr('class', 'x-grid').attr('transform', gridTrans);
  var yGrid = target.root.append('g').attr('class', 'y-grid');
  return { x: xGrid, y: yGrid };
};

var MountAxis = function MountAxis(target) {
  var xAxisTrans = 'translate(0, ' + target.h + ')';
  var xAxis = target.root.append('g').attr('class', 'x-axis').attr('transform', xAxisTrans);
  var yAxis = target.root.append('g').attr('class', 'y-axis');
  return { x: xAxis, y: yAxis };
};

var MountAxisLabelX = function MountAxisLabelX(target) {
  var xTrans = 'translate(' + target.w / 2 + ', ' + (target.h + 30) + ')';
  target.root.append('text').attr('text-anchor', 'middle').attr('transform', xTrans).attr('class', 'xLabel').attr('font-family', 'Helvetica').style('font-size', '12px');
};

var MountAxisLabelY = function MountAxisLabelY(target) {
  var yR = 'rotate(-90)';
  var yTrans = 'translate(' + (16 - target.margin.l) + ', ' + target.h / 2 + ') ' + yR;
  target.root.append('text').attr('text-anchor', 'middle').attr('transform', yTrans).attr('class', 'yLabel').attr('font-family', 'Helvetica').style('font-size', '12px');
};

var MountMarker = function MountMarker(target, color) {
  var tTrans = 'translate(' + (target.w - 80) + ', -10)';
  var lTrans = 'translate(' + (target.w - 200) + ', -18)';
  target.root.append('text').attr('text-anchor', 'middle').attr('transform', tTrans).attr('class', 'mark-text').attr('font-family', 'Helvetica');

  target.root.append('rect').attr('transform', lTrans).attr('width', 30).attr('height', 5).attr('class', 'mark-line').style('fill', color);
};

var MountClip = function MountClip(target) {
  target.svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', target.w).attr('height', target.h).attr('x', 0).attr('y', 0);
};

var MountMainFrame = function MountMainFrame(target, name) {
  var transFrame = 'translate(' + target.margin.l + ', ' + target.margin.t + ')';
  var clsName = name + '-main';

  target.svg.append('g').attr('class', clsName).attr('transform', transFrame);
};

exports.MountTags = MountTags;
exports.MountRef = MountRef;
exports.MountPath = MountPath;
exports.MountThresLine = MountThresLine;
exports.MountGrid = MountGrid;
exports.MountAxis = MountAxis;
exports.MountComparePath = MountComparePath;
exports.MountAxisLabelX = MountAxisLabelX;
exports.MountAxisLabelY = MountAxisLabelY;
exports.MountMarker = MountMarker;
exports.MountClip = MountClip;
exports.MountMainFrame = MountMainFrame;
exports.MountBars = MountBars;