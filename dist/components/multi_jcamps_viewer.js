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
var _curve = require("../actions/curve");
var _cyclic_voltammetry = require("../actions/cyclic_voltammetry");
var _list_layout = require("../constants/list_layout");
var _format = _interopRequireDefault(require("../helpers/format"));
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
      theoryMass,
      layoutSt
    } = this.props;
    if (!entities || entities.length === 0) return /*#__PURE__*/_react.default.createElement("div", null);
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.root
    }, /*#__PURE__*/_react.default.createElement(_index2.default, {
      feature: feature,
      operations: operations,
      editorOnly: true,
      hideThreshold: true
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "react-spectrum-editor"
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 9
    }, /*#__PURE__*/_react.default.createElement(_index3.default, {
      entities: entities,
      topic: topic,
      xLabel: feature.xUnit,
      yLabel: feature.yUnit,
      feature: feature
    })), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 3,
      align: "center"
    }, /*#__PURE__*/_react.default.createElement(_index.default, {
      jcampIdx: curveIdx,
      entityFileNames: entityFileNames,
      userManualLink: userManualLink,
      feature: feature,
      molSvg: molSvg,
      theoryMass: theoryMass,
      subLayoutsInfo: seperatedSubLayouts,
      descriptions: "",
      canChangeDescription: () => {},
      onDescriptionChanged: () => {}
    })))));
  }
}
const mapStateToProps = (state, _) => (
// eslint-disable-line
{
  curveSt: state.curve,
  cyclicVoltaSt: state.cyclicvolta,
  entities: state.curve.listCurves,
  layoutSt: state.layout
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
  theoryMass: _propTypes.default.string
};
MultiJcampsViewer.defaultProps = {
  multiEntities: [],
  entityFileNames: [],
  molSvg: '',
  cLabel: '',
  xLabel: '',
  yLabel: '',
  entities: []
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(MultiJcampsViewer);