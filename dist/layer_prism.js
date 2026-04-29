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
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, default-param-last,
react/function-component-definition, react/require-default-props
*/

const styles = () => ({});
const LayerPrism = ({
  entity,
  cLabel,
  xLabel,
  yLabel,
  forecast,
  operations,
  descriptions,
  molSvg,
  editorOnly,
  exactMass,
  thresSt,
  scanSt,
  uiSt,
  canChangeDescription,
  onDescriptionChanged
}) => {
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
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.default, {
        feature: feature,
        hasEdit: hasEdit,
        forecast: forecast,
        operations: operations,
        editorOnly: editorOnly
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "react-spectrum-editor",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          container: true,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
            item: true,
            xs: 12,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_layer_content.default, {
              topic: topic,
              feature: feature,
              cLabel: cLabel,
              xLabel: xLabel,
              yLabel: yLabel,
              forecast: forecast,
              operations: operations
            })
          })
        })
      })]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.default, {
      feature: feature,
      hasEdit: hasEdit,
      forecast: forecast,
      operations: operations,
      editorOnly: editorOnly
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "react-spectrum-editor",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 9,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_layer_content.default, {
            topic: topic,
            feature: feature,
            cLabel: cLabel,
            xLabel: xLabel,
            yLabel: yLabel,
            forecast: forecast,
            operations: operations
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 3,
          align: "center",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.default, {
            feature: feature,
            integration: integration,
            editorOnly: editorOnly,
            molSvg: molSvg,
            exactMass: exactMass,
            descriptions: descriptions,
            canChangeDescription: canChangeDescription,
            onDescriptionChanged: onDescriptionChanged
          })
        })]
      })
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  scanSt: state.scan,
  thresSt: state.threshold.list[state.curve.curveIdx],
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
  exactMass: _propTypes.default.string,
  forecast: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  thresSt: _propTypes.default.object.isRequired,
  scanSt: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerPrism)); // eslint-disable-line