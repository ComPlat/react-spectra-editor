"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _comps = require("./comps");
var _ir_comps = require("./ir_comps");
const Styles = () => ({
  root: {
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  container: {
    minHeight: '400px'
  },
  svgRoot: {
    margin: '10px 40px 0px 40px',
    height: 'calc(70vh)',
    overflowY: 'hidden'
  },
  tableRoot: {
    margin: '10px 40px 0px 40px',
    maxHeight: 'calc(70vh)',
    overflowY: 'scroll'
  },
  title: {
    textAlign: 'left'
  },
  btn: {
    marginLeft: 40
  },
  reference: {
    borderTop: '1px solid #cfd8dc',
    margin: '10px 40px 0px 40px',
    padding: 5
  },
  inputRoot: {
    margin: '10px 40px 0px 40px'
  },
  txtLabel: {
    fontSize: '12px'
  },
  submit: {
    margin: '0 0 0 30px',
    width: 300
  }
});
const sectionTable = (classes, pds) => {
  const renderMsg = (0, _comps.notToRenderAnalysis)(pds);
  if (renderMsg) return renderMsg;
  if (!pds.output.result || !pds.output.result[0]) return null;
  const {
    fgs
  } = pds.output.result[0];
  if (!fgs) return null;
  return /*#__PURE__*/_react.default.createElement(_material.Paper, {
    className: classes.tableRoot
  }, /*#__PURE__*/_react.default.createElement(_material.Table, {
    className: classes.table,
    size: "small"
  }, (0, _ir_comps.IrTableHeader)(classes), /*#__PURE__*/_react.default.createElement(_material.TableBody, null, fgs.sort((a, b) => b.confidence - a.confidence).map((fg, idx) => (0, _ir_comps.IrTableBodyRow)(classes, idx, fg)))));
};
const IrViewer = _ref => {
  let {
    // eslint-disable-line
    classes,
    molecule,
    inputCb,
    forecastSt
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.root, 'card-forecast-viewer')
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    className: (0, _classnames.default)(classes.container),
    container: true
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 4
  }, /*#__PURE__*/_react.default.createElement(_material.Paper, {
    className: classes.svgRoot
  }, (0, _comps.sectionSvg)(classes, forecastSt.predictions))), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 8
  }, sectionTable(classes, forecastSt.predictions))), (0, _comps.sectionInput)(classes, molecule, inputCb));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  forecastSt: state.forecast
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
IrViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  molecule: _propTypes.default.string.isRequired,
  inputCb: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.bool]),
  forecastSt: _propTypes.default.object.isRequired
};
IrViewer.defaultProps = {
  inputCb: false
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(Styles))(IrViewer);