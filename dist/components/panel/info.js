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
var _reactSvgFileZoomPan = _interopRequireDefault(require("@complat/react-svg-file-zoom-pan"));
var _reactQuill = _interopRequireDefault(require("react-quill"));
var _material = require("@mui/material");
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _styles = require("@mui/styles");
var _format = _interopRequireDefault(require("../../helpers/format"));
/* eslint-disable no-mixed-operators, react/function-component-definition,
react/require-default-props */

const styles = () => ({
  chip: {
    margin: '1px 0 1px 0'
  },
  panel: {
    backgroundColor: '#eee',
    display: 'table-row'
  },
  panelSummary: {
    backgroundColor: '#eee',
    height: 32
  },
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)',
    // ROI
    overflow: 'auto'
  },
  table: {
    width: 'auto'
  },
  rowRoot: {
    border: '1px solid #eee',
    height: 36,
    lineHeight: '36px',
    overflow: 'hidden',
    paddingLeft: 24,
    textAlign: 'left'
  },
  rowOdd: {
    backgroundColor: '#fff',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  rowEven: {
    backgroundColor: '#fafafa',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  rowOddSim: {
    backgroundColor: '#fff',
    height: 108,
    lineHeight: '24px',
    overflowY: 'scroll',
    overflowWrap: 'word-break'
  },
  tHead: {
    fontWeight: 'bold',
    float: 'left',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica'
  },
  tTxt: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    marginRight: 3
  },
  quill: {
    backgroundColor: '#fafafa',
    border: '1px solid #eee',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    padding: '0 10px 0 10px',
    textAlign: 'left'
  }
});
const simTitle = () => 'Simulated signals from NMRshiftDB';
const simContent = nmrSimPeaks => nmrSimPeaks && nmrSimPeaks.sort((a, b) => a - b).join(', ');
const aucValue = integration => {
  if (!integration) {
    return '';
  }
  const values = [];
  const stackIntegration = integration.stack;
  if (Array.isArray(stackIntegration)) {
    let sumVal = 0.0;
    stackIntegration.forEach(inte => {
      if (inte.absoluteArea) {
        sumVal += inte.absoluteArea;
      }
    });
    sumVal = sumVal.toFixed(2);
    stackIntegration.forEach(inte => {
      if (inte.absoluteArea) {
        const areaVal = inte.absoluteArea.toFixed(2);
        const percent = (areaVal * 100 / sumVal).toFixed(2);
        const valStr = areaVal + " (" + percent + "%)"; // eslint-disable-line
        values.push(valStr);
      }
    });
  }
  return values.join(', ');
};
const InfoPanel = _ref => {
  let {
    classes,
    expand,
    feature,
    integration,
    editorOnly,
    molSvg,
    descriptions,
    layoutSt,
    simulationSt,
    shiftSt,
    curveSt,
    onExapnd,
    canChangeDescription,
    onDescriptionChanged
  } = _ref;
  if (!feature) return null;
  const {
    title,
    observeFrequency,
    solventName
  } = feature;
  const {
    curveIdx
  } = curveSt;
  const {
    shifts
  } = shiftSt;
  const selectedShift = shifts[curveIdx];
  let showSolvName = solventName;
  if (selectedShift !== undefined) {
    const shiftName = selectedShift.ref.name;
    showSolvName = shiftName === '- - -' ? solventName : shiftName;
  }
  let originStack = null;
  if (integration) {
    originStack = integration.originStack; // eslint-disable-line
  }

  return /*#__PURE__*/_react.default.createElement(_material.Accordion, {
    expanded: expand,
    onChange: onExapnd,
    className: (0, _classnames.default)(classes.panel),
    TransitionProps: {
      unmountOnExit: true
    } // increase Accordion performance
  }, /*#__PURE__*/_react.default.createElement(_material.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null),
    className: (0, _classnames.default)(classes.panelSummary)
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    className: "txt-panel-header"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title')
  }, "Info"))), /*#__PURE__*/_react.default.createElement(_material.Divider, null), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.panelDetail)
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')
  }, "Title : "), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, title)), _format.default.isNmrLayout(layoutSt) ? /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.rowRoot, classes.rowEven)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')
  }, "Freq : "), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, parseInt(observeFrequency, 10) || ' - ')) : null, _format.default.isNmrLayout(layoutSt) ? /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')
  }, "Solv : "), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, showSolvName)) : null, !molSvg ? null : /*#__PURE__*/_react.default.createElement(_reactSvgFileZoomPan.default, {
    svg: molSvg,
    duration: 300,
    resize: true
  }), _format.default.isHplcUvVisLayout(layoutSt) ? /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.rowRoot, classes.rowOddSim)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')
  }, "Area under curve (AUC):"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')
  }, aucValue(integration))) : null), !_format.default.isCyclicVoltaLayout(layoutSt) ? /*#__PURE__*/_react.default.createElement(_reactQuill.default, {
    className: (0, _classnames.default)(classes.quill, 'card-sv-quill'),
    value: descriptions,
    modules: {
      toolbar: false
    },
    onChange: onDescriptionChanged,
    readOnly: canChangeDescription !== undefined ? !canChangeDescription : true
  }) : null, /*#__PURE__*/_react.default.createElement("div", null, !editorOnly && _format.default.isNmrLayout(layoutSt) ? /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.rowRoot, classes.rowOddSim)
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')
  }, simTitle(), ":"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')
  }, simContent(simulationSt.nmrSimPeaks))) : null));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  simulationSt: state.simulation,
  shiftSt: state.shift,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
InfoPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  feature: _propTypes.default.object.isRequired,
  integration: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  simulationSt: _propTypes.default.array.isRequired,
  shiftSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(InfoPanel)); // eslint-disable-line