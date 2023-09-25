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
/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props */

const styles = () => Object.assign({}, {}, _common.commonStyle);
const CmdBar = _ref => {
  let {
    classes,
    feature,
    hasEdit,
    forecast,
    operations,
    editorOnly,
    jcampIdx,
    hideThreshold
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: classes.card
  }, /*#__PURE__*/_react.default.createElement(_viewer.default, {
    editorOnly: editorOnly
  }), /*#__PURE__*/_react.default.createElement(_zoom.default, null), /*#__PURE__*/_react.default.createElement(_peak.default, {
    jcampIdx: jcampIdx
  }), /*#__PURE__*/_react.default.createElement(_pecker.default, {
    jcampIdx: jcampIdx
  }), /*#__PURE__*/_react.default.createElement(_integration.default, null), /*#__PURE__*/_react.default.createElement(_multiplicity.default, null), /*#__PURE__*/_react.default.createElement(_undo_redo.default, null), /*#__PURE__*/_react.default.createElement(_r04_submit.default, {
    operations: operations,
    feature: feature,
    forecast: forecast,
    editorOnly: editorOnly,
    hideSwitch: false,
    disabled: false
  }), hideThreshold ? null : /*#__PURE__*/_react.default.createElement(_r03_threshold.default, {
    feature: feature,
    hasEdit: hasEdit
  }), /*#__PURE__*/_react.default.createElement(_r01_layout.default, {
    feature: feature,
    hasEdit: hasEdit
  }), /*#__PURE__*/_react.default.createElement(_r07_wavelength_btn.default, null));
};
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