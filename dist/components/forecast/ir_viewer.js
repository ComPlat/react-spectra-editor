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
var _styles2 = _interopRequireDefault(require("./styles"));
var _jsxRuntime = require("react/jsx-runtime");
const Styles = () => ({
  ...(0, _styles2.default)()
});
const sectionTable = (classes, pds) => {
  const renderMsg = (0, _comps.notToRenderAnalysis)(pds, classes);
  if (renderMsg) return renderMsg;
  if (!pds.output.result || !pds.output.result[0]) return null;
  const {
    fgs
  } = pds.output.result[0];
  if (!fgs) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Table, {
    className: classes.table,
    size: "small",
    stickyHeader: true,
    children: [(0, _ir_comps.IrTableHeader)(classes), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableBody, {
      children: fgs.sort((a, b) => b.confidence - a.confidence).map((fg, idx) => (0, _ir_comps.IrTableBodyRow)(classes, idx, fg))
    })]
  });
};
const IrViewer = ({
  // eslint-disable-line
  classes,
  molecule,
  inputCb,
  forecastSt
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  className: (0, _classnames.default)(classes.root, 'card-forecast-viewer'),
  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Grid, {
    container: true,
    spacing: 2,
    className: classes.analysisGrid,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Grid, {
      item: true,
      xs: 12,
      md: 4,
      className: classes.structureCol,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.sectionHeader,
        children: "Structure"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.structureFrame,
        children: (0, _comps.sectionSvg)(classes, forecastSt.predictions)
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Grid, {
      item: true,
      xs: 12,
      md: 8,
      className: classes.tableCol,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.sectionHeader,
        children: "Functional groups"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.tableFrame,
        children: sectionTable(classes, forecastSt.predictions)
      })]
    })]
  }), (0, _comps.sectionInput)(classes, molecule, inputCb)]
});
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