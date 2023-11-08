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
var _styles = require("@material-ui/core/styles");
var _Table = _interopRequireDefault(require("@material-ui/core/Table"));
var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));
var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));
var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));
var _comps = require("./comps");
var _nmr_comps = require("./nmr_comps");
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
  const dict = pds.output.result[0];
  if (!dict) return /*#__PURE__*/_react.default.createElement("div", null);
  return /*#__PURE__*/_react.default.createElement(_Paper.default, {
    className: classes.tableRoot
  }, /*#__PURE__*/_react.default.createElement(_Table.default, {
    className: classes.table,
    size: "small"
  }, (0, _nmr_comps.NmrTableHeader)(classes), /*#__PURE__*/_react.default.createElement(_TableBody.default, null, dict.shifts.sort((a, b) => a.atom - b.atom).map((row, idx) => (0, _nmr_comps.NmrTableBodyRow)(classes, row, idx)))));
};
const NmrViewer = _ref => {
  let {
    // eslint-disable-line
    classes,
    molecule,
    inputCb,
    forecastSt
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.root, 'card-forecast-viewer')
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    className: (0, _classnames.default)(classes.container),
    container: true
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 4
  }, /*#__PURE__*/_react.default.createElement(_Paper.default, {
    className: classes.svgRoot
  }, (0, _comps.sectionSvg)(classes, forecastSt.predictions))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 8
  }, sectionTable(classes, forecastSt.predictions))), (0, _comps.sectionInput)(classes, molecule, inputCb), (0, _nmr_comps.SectionReference)(classes));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  forecastSt: state.forecast
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
NmrViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  molecule: _propTypes.default.string.isRequired,
  inputCb: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.bool]),
  forecastSt: _propTypes.default.object.isRequired
};
NmrViewer.defaultProps = {
  inputCb: false
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(Styles))(NmrViewer);