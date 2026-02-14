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
var _index = _interopRequireDefault(require("./panel/index"));
var _index2 = _interopRequireDefault(require("./cmd_bar/index"));
var _index3 = _interopRequireDefault(require("./d3_multi/index"));
var _forecast_viewer = _interopRequireDefault(require("./forecast_viewer"));
var _curve = require("../actions/curve");
var _cyclic_voltammetry = require("../actions/cyclic_voltammetry");
var _list_layout = require("../constants/list_layout");
var _list_ui = require("../constants/list_ui");
var _format = _interopRequireDefault(require("../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/default-props-match-prop-types,
react/require-default-props, react/no-unused-prop-types, react/jsx-boolean-value,
prefer-object-spread */

const styles = () => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: 'none'
  },
  tabLabel: {
    fontSize: '14px'
  }
});
const seperatingSubLayout = (entities, featureCondition, layoutSt) => {
  if (layoutSt === _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
    return null;
  }
  const storedDict = {};
  entities.forEach(entity => {
    const {
      feature
    } = entity;
    const keyValue = feature[featureCondition];
    if (keyValue in storedDict) {
      storedDict[keyValue].push(entity);
    } else {
      storedDict[keyValue] = [entity];
    }
  });
  return Object.assign({}, storedDict);
};
class MultiJcampsViewer extends _react.default.Component {
  // eslint-disable-line
  render() {
    const {
      classes,
      curveSt,
      operations,
      entityFileNames,
      entities,
      userManualLink,
      molSvg,
      exactMass,
      layoutSt,
      integrationSt,
      descriptions,
      canChangeDescription,
      onDescriptionChanged,
      forecast,
      uiSt,
      cLabel
    } = this.props;
    if (!entities || entities.length === 0) return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {});
    const separateCondition = _format.default.isGCLayout(layoutSt) ? 'yUnit' : 'xUnit';
    const seperatedSubLayouts = seperatingSubLayout(entities, separateCondition, layoutSt);
    const {
      curveIdx
    } = curveSt;
    const entity = entities[curveIdx];
    const {
      feature,
      topic
    } = entity;
    const {
      integrations
    } = integrationSt;
    const currentIntegration = integrations[curveIdx];
    const isNmr = _format.default.isNmrLayout(layoutSt);
    const isIr = _format.default.isIrLayout(layoutSt);
    const isUvvis = _format.default.isUvVisLayout(layoutSt) || _format.default.isHplcUvVisLayout(layoutSt);
    const isXRD = _format.default.isXRDLayout(layoutSt);
    const hasForecast = forecast && Object.keys(forecast).length > 0;
    const showForecast = hasForecast && (isNmr || isIr || isUvvis || isXRD) && uiSt.viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS;
    const xLabel = feature.xUnit ? `X (${feature.xUnit})` : '';
    const yLabel = feature.yUnit ? `Y (${feature.yUnit})` : '';
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.root,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.default, {
        feature: feature,
        operations: operations,
        forecast: forecast,
        editorOnly: true,
        hideThreshold: !_format.default.isNmrLayout(layoutSt)
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "react-spectrum-editor",
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
          container: true,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
            item: true,
            xs: 9,
            children: showForecast ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_forecast_viewer.default, {
              topic: topic,
              cLabel: cLabel,
              xLabel: xLabel,
              yLabel: yLabel,
              feature: feature,
              forecast: forecast,
              isNmr: isNmr,
              isIr: isIr,
              isUvvis: isUvvis,
              isXRD: isXRD
            }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_index3.default, {
              entities: entities,
              topic: topic,
              xLabel: feature.xUnit,
              yLabel: feature.yUnit,
              feature: feature
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
            item: true,
            xs: 3,
            align: "center",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.default, {
              jcampIdx: curveIdx,
              entityFileNames: entityFileNames,
              userManualLink: userManualLink,
              feature: feature,
              molSvg: molSvg,
              exactMass: exactMass,
              subLayoutsInfo: seperatedSubLayouts,
              integration: currentIntegration,
              descriptions: descriptions,
              canChangeDescription: canChangeDescription,
              onDescriptionChanged: onDescriptionChanged
            })
          })]
        })
      })]
    });
  }
}
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  curveSt: state.curve,
  cyclicVoltaSt: state.cyclicvolta,
  entities: state.curve.listCurves,
  layoutSt: state.layout,
  integrationSt: state.integration.present,
  uiSt: state.ui
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setAllCurvesAct: _curve.setAllCurves,
  addNewCylicVoltaPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
  addCylicVoltaMaxPeakAct: _cyclic_voltammetry.addCylicVoltaMaxPeak,
  addCylicVoltaMinPeakAct: _cyclic_voltammetry.addCylicVoltaMinPeak,
  addCylicVoltaPeckerAct: _cyclic_voltammetry.addCylicVoltaPecker
}, dispatch);
MultiJcampsViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  multiEntities: _propTypes.default.array.isRequired,
  entityFileNames: _propTypes.default.array.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  setAllCurvesAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  cyclicVoltaSt: _propTypes.default.object.isRequired,
  addNewCylicVoltaPairPeakAct: _propTypes.default.func.isRequired,
  addCylicVoltaMaxPeakAct: _propTypes.default.func.isRequired,
  addCylicVoltaMinPeakAct: _propTypes.default.func.isRequired,
  operations: _propTypes.default.func.isRequired,
  userManualLink: _propTypes.default.object,
  entities: _propTypes.default.array,
  layoutSt: _propTypes.default.string.isRequired,
  exactMass: _propTypes.default.string,
  integrationSt: _propTypes.default.object.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  forecast: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string
};
MultiJcampsViewer.defaultProps = {
  multiEntities: [],
  entityFileNames: [],
  molSvg: '',
  entities: [],
  descriptions: [],
  canChangeDescription: false,
  forecast: {},
  cLabel: ''
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(MultiJcampsViewer);