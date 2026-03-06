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
var _extractEntityLCMS = require("../helpers/extractEntityLCMS");
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
class HPLCViewer extends _react.default.Component {
  // eslint-disable-line
  render() {
    const {
      classes,
      curveState,
      operations,
      entityFileNames,
      entities,
      userManualLink,
      molSvg,
      theoryMass,
      integrationState,
      hplcMsState,
      descriptions,
      canChangeDescription,
      onDescriptionChanged,
      editorOnly,
      forecast
    } = this.props;
    if (!entities || entities.length === 0) return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {});
    const {
      curveIdx
    } = curveState;
    const entity = entities[curveIdx];
    if (!entity) return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {});
    const {
      feature,
      topic
    } = entity || {};
    const {
      ticEntities,
      uvvisEntities,
      mzEntities
    } = (0, _extractEntityLCMS.splitAndReindexEntities)(entities);
    const displayFeature = feature || entities[0]?.feature || entities[0]?.features?.[0] || {};
    const hasEdit = !!displayFeature?.data?.[0]?.x?.length;
    const {
      integrations
    } = integrationState;
    const currentIntegration = integrations[curveIdx];
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.root,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.default, {
        feature: displayFeature,
        hasEdit: hasEdit,
        forecast: forecast || {},
        operations: operations,
        editorOnly: editorOnly,
        hideThreshold: true,
        hideMainEditTools: true
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "react-spectrum-editor",
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Grid, {
          container: true,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Grid, {
            item: true,
            xs: 9,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_index3.default, {
              ticEntities: ticEntities,
              uvvisEntities: uvvisEntities,
              mzEntities: mzEntities,
              topic: topic,
              xLabel: displayFeature?.xUnit || '',
              yLabel: displayFeature?.yUnit || '',
              feature: displayFeature,
              jcampIdx: curveIdx,
              hplcMsSt: hplcMsState,
              isHidden: false
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Grid, {
            item: true,
            xs: 3,
            align: "center",
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.default, {
              entities: entities,
              jcampIdx: curveIdx,
              entityFileNames: entityFileNames,
              userManualLink: userManualLink,
              feature: displayFeature,
              molSvg: molSvg,
              theoryMass: theoryMass,
              descriptions: descriptions,
              integration: currentIntegration,
              canChangeDescription: canChangeDescription,
              onDescriptionChanged: onDescriptionChanged,
              editorOnly: editorOnly
            })
          })]
        })
      })]
    });
  }
}
const mapStateToProps = state => ({
  curveState: state.curve,
  entities: state.curve.listCurves,
  integrationState: state.integration.present,
  hplcMsState: state.hplcMs
});
HPLCViewer.propTypes = {
  classes: _propTypes.default.object.isRequired,
  entityFileNames: _propTypes.default.array.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  curveState: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  forecast: _propTypes.default.object,
  userManualLink: _propTypes.default.object,
  entities: _propTypes.default.array,
  theoryMass: _propTypes.default.string,
  integrationState: _propTypes.default.object.isRequired,
  hplcMsState: _propTypes.default.object.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  editorOnly: _propTypes.default.bool.isRequired
};
HPLCViewer.defaultProps = {
  entityFileNames: [],
  molSvg: '',
  cLabel: '',
  xLabel: '',
  yLabel: '',
  entities: [],
  forecast: {},
  onDescriptionChanged: () => {}
};
var _default = exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps), (0, _styles.withStyles)(styles))(HPLCViewer);