"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _common = require("./common");
var _viewer = _interopRequireDefault(require("./01_viewer"));
var _zoom = _interopRequireDefault(require("./02_zoom"));
var _peak = _interopRequireDefault(require("./03_peak"));
var _integration = _interopRequireDefault(require("./04_integration"));
var _multiplicity = _interopRequireDefault(require("./05_multiplicity"));
var _undo_redo = _interopRequireDefault(require("./06_undo_redo"));
var _r01_layout = _interopRequireDefault(require("./r01_layout"));
var _r03_threshold = _interopRequireDefault(require("./r03_threshold"));
var _r04_submit = _interopRequireDefault(require("./r04_submit"));
var _r07_wavelength_btn = _interopRequireDefault(require("./r07_wavelength_btn"));
var _pecker = _interopRequireDefault(require("./07_pecker"));
var _r08_change_axes = _interopRequireDefault(require("./r08_change_axes"));
var _r09_detector = _interopRequireDefault(require("./r09_detector"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props */

const styles = () => Object.assign({}, {}, _common.commonStyle);
const CmdBar = ({
  classes,
  feature,
  hasEdit,
  forecast,
  operations,
  editorOnly,
  jcampIdx,
  hideThreshold
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  className: classes.card,
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_viewer.default, {
    editorOnly: editorOnly
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_zoom.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_peak.default, {
    jcampIdx: jcampIdx,
    feature: feature
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_pecker.default, {
    jcampIdx: jcampIdx
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_integration.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_multiplicity.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_undo_redo.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r04_submit.default, {
    operations: operations,
    feature: feature,
    forecast: forecast,
    editorOnly: editorOnly,
    hideSwitch: false,
    disabled: false
  }), hideThreshold ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_r03_threshold.default, {
    feature: feature,
    hasEdit: hasEdit
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r01_layout.default, {
    feature: feature,
    hasEdit: hasEdit
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r07_wavelength_btn.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r08_change_axes.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_r09_detector.default, {})]
});
const mapStateToProps = (state, _) => (
// eslint-disable-line
{});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
CmdBar.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  forecast: _propTypes.default.object.isRequired,
  hasEdit: _propTypes.default.bool.isRequired,
  operations: _propTypes.default.array.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  jcampIdx: _propTypes.default.any,
  hideThreshold: _propTypes.default.bool
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _withStyles.default)(styles))(CmdBar);