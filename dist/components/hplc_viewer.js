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
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _index = _interopRequireDefault(require("./panel/index"));
var _index2 = _interopRequireDefault(require("./cmd_bar/index"));
var _index3 = _interopRequireDefault(require("./d3_line_rect/index"));
var _curve = require("../actions/curve");
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
class HPLCViewer extends _react.default.Component {
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
      theoryMass
    } = this.props;
    if (!entities || entities.length === 0) return /*#__PURE__*/_react.default.createElement("div", null);
    const {
      curveIdx
    } = curveSt;
    const entity = entities[curveIdx];
    const {
      feature,
      topic
    } = entity;
    const ticEntities = entities.slice(0, 2);
    const dataEntities = entities.slice(2);
    return /*#__PURE__*/_react.default.createElement("div", {
      className: classes.root
    }, /*#__PURE__*/_react.default.createElement(_index2.default, {
      feature: feature,
      operations: operations,
      editorOnly: true,
      hideThreshold: true,
      hideMainEditTools: true
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "react-spectrum-editor"
    }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
      container: true
    }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true,
      xs: 9
    }, /*#__PURE__*/_react.default.createElement(_index3.default, {
      entities: ticEntities,
      subEntities: dataEntities,
      topic: topic,
      xLabel: feature.xUnit,
      yLabel: feature.yUnit,
      feature: feature
    })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
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
  entities: state.curve.listCurves,
  layoutSt: state.layout
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setAllCurvesAct: _curve.setAllCurves
}, dispatch);
HPLCViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  entityFileNames: _propTypes.default.array.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  setAllCurvesAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  operations: _propTypes.default.func.isRequired,
  userManualLink: _propTypes.default.object,
  entities: _propTypes.default.array,
  layoutSt: _propTypes.default.string.isRequired,
  theoryMass: _propTypes.default.string
};
HPLCViewer.defaultProps = {
  entityFileNames: [],
  molSvg: '',
  cLabel: '',
  xLabel: '',
  yLabel: '',
  entities: []
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(HPLCViewer);