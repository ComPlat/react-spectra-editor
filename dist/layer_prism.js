"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _styles = require("@mui/styles");
var _index = _interopRequireDefault(require("./components/panel/index"));
var _index2 = _interopRequireDefault(require("./components/cmd_bar/index"));
var _layer_content = _interopRequireDefault(require("./layer_content"));
var _list_ui = require("./constants/list_ui");
var _extractParams = require("./helpers/extractParams");
/* eslint-disable prefer-object-spread, default-param-last,
react/function-component-definition, react/require-default-props
*/

const styles = () => ({});
const LayerPrism = _ref => {
  let {
    entity,
    cLabel,
    xLabel,
    yLabel,
    forecast,
    operations,
    descriptions,
    molSvg,
    editorOnly,
    theoryMass,
    thresSt,
    scanSt,
    uiSt,
    canChangeDescription,
    onDescriptionChanged,
    isComparison
  } = _ref;
  const {
    topic,
    feature,
    hasEdit,
    integration
  } = (0, _extractParams.extractParams)(entity, thresSt, scanSt);
  if (!topic) return null;
  const {
    viewer
  } = uiSt;
  if (viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS) {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_index2.default, {
      feature: feature,
      hasEdit: hasEdit,
      forecast: forecast,
      operations: operations,
      editorOnly: editorOnly
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "react-spectrum-editor"
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 12
    }, /*#__PURE__*/_react.default.createElement(_layer_content.default, {
      topic: topic,
      feature: feature,
      cLabel: cLabel,
      xLabel: xLabel,
      yLabel: yLabel,
      forecast: forecast,
      operations: operations
    })))));
  }
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_index2.default, {
    feature: feature,
    hasEdit: hasEdit,
    forecast: forecast,
    operations: operations,
    editorOnly: editorOnly,
    isComparison: isComparison
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "react-spectrum-editor"
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 9
  }, /*#__PURE__*/_react.default.createElement(_layer_content.default, {
    topic: topic,
    feature: feature,
    cLabel: cLabel,
    xLabel: xLabel,
    yLabel: yLabel,
    forecast: forecast,
    operations: operations
  })), /*#__PURE__*/_react.default.createElement(_Grid.default, {
    item: true,
    xs: 3,
    align: "center"
  }, /*#__PURE__*/_react.default.createElement(_index.default, {
    feature: feature,
    integration: integration,
    editorOnly: editorOnly,
    molSvg: molSvg,
    theoryMass: theoryMass,
    descriptions: descriptions,
    canChangeDescription: canChangeDescription,
    onDescriptionChanged: onDescriptionChanged
  })))));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  scanSt: state.scan,
  thresSt: state.threshold,
  uiSt: state.ui
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
LayerPrism.propTypes = {
  entity: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  theoryMass: _propTypes.default.string,
  forecast: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  thresSt: _propTypes.default.object.isRequired,
  scanSt: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  isComparison: _propTypes.default.bool.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerPrism)); // eslint-disable-line