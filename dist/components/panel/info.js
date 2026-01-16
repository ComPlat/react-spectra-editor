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
var _meta = require("../../actions/meta");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable no-mixed-operators, react/function-component-definition,
react/require-default-props, max-len */

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
    height: 32,
    minHeight: 32,
    '& .MuiAccordionSummary-content': {
      margin: 0
    }
  },
  subSectionHeader: {
    backgroundColor: '#eee',
    height: 32,
    lineHeight: '32px',
    paddingLeft: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    borderTop: '1px solid #dcdcdc',
    color: 'rgba(0, 0, 0, 0.87)'
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
    overflowY: 'hidden',
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
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    textAlign: 'left'
  },
  quillContainer: {
    margin: '10px 10px',
    backgroundColor: '#fff',
    '& .ql-container': {
      border: 'none'
    },
    '& .ql-editor': {
      minHeight: '60px'
    },
    '& .ql-editor.ql-blank::before': {
      fontStyle: 'normal',
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
});
const simTitle = () => 'Simulated signals from NMRshiftDB';
const simContent = nmrSimPeaks => nmrSimPeaks && nmrSimPeaks.sort((a, b) => a - b).join(', ');
const normalizeQuillValue = val => {
  if (!val) return '';
  if (val === '<p><br></p>' || val === '<p></p>') return '';
  return val;
};
const handleDescriptionChanged = (value, onDescriptionChanged) => {
  onDescriptionChanged(normalizeQuillValue(value));
};
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
const SECData = ({
  classes,
  layout,
  detector,
  secData
}) => {
  if (_format.default.isSECLayout(layout) && secData) {
    const {
      d,
      mn,
      mp,
      mw
    } = secData;
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "Detector: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: detector
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowEven),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "D: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: d
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "MN: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: mn
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowEven),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "MP: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: mp
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "MW: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: mw
        })]
      })]
    });
  }
  return null;
};
SECData.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layout: _propTypes.default.string.isRequired,
  detector: _propTypes.default.object.isRequired,
  secData: _propTypes.default.object.isRequired
};
const DSCData = ({
  classes,
  layout,
  dscMetaData,
  updateAction
}) => {
  if (_format.default.isDSCLayout(layout) && dscMetaData !== undefined) {
    const {
      meltingPoint,
      tg
    } = dscMetaData;
    const onChange = e => {
      const {
        name,
        value
      } = e.target;
      const dataToUpdate = {
        meltingPoint,
        tg
      };
      dataToUpdate[name] = value;
      updateAction(dataToUpdate);
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "Melting Point: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          type: "text",
          name: "meltingPoint",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          value: meltingPoint,
          onChange: onChange
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowEven),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "TG: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          type: "text",
          name: "tg",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          value: tg,
          onChange: onChange
        })]
      })]
    });
  }
  return null;
};
DSCData.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layout: _propTypes.default.string.isRequired,
  dscMetaData: _propTypes.default.object.isRequired,
  updateAction: _propTypes.default.func.isRequired
};
const InfoPanel = ({
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
  exactMass,
  onExapnd,
  canChangeDescription,
  onDescriptionChanged,
  detectorSt,
  metaSt,
  updateDSCMetaDataAct
}) => {
  if (!feature) return null;
  const {
    title,
    observeFrequency,
    solventName,
    secData
  } = feature;
  const {
    dscMetaData
  } = metaSt;
  const {
    curveIdx
  } = curveSt;
  const {
    curves
  } = detectorSt;
  const getSelectedDetectorForCurve = (_detectorSt, targetCurveIdx) => {
    const targetCurve = curves.find(curve => curve.curveIdx === targetCurveIdx);
    return targetCurve ? targetCurve.selectedDetector.name : '';
  };
  let selectedDetector = getSelectedDetectorForCurve(detectorSt, curveIdx);

  // default detector from jcamp
  if (!selectedDetector && feature.detector) {
    selectedDetector = feature.detector;
  }
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Accordion, {
    "data-testid": "PanelInfo",
    expanded: expand,
    onChange: onExapnd,
    className: (0, _classnames.default)(classes.panel),
    TransitionProps: {
      unmountOnExit: true
    } // increase Accordion performance
    ,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.AccordionSummary, {
      expandIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandMore.default, {}),
      className: (0, _classnames.default)(classes.panelSummary),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Typography, {
        className: "txt-panel-header",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title'),
          children: "Info"
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Divider, {}), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: (0, _classnames.default)(classes.panelDetail),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "Title : "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: title
        })]
      }), _format.default.isNmrLayout(layoutSt) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowEven),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "Freq : "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: `${parseInt(observeFrequency, 10)} MHz` || ' - '
        })]
      }) : null, _format.default.isNmrLayout(layoutSt) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "Solv : "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: showSolvName
        })]
      }) : null, _format.default.isMsLayout(layoutSt) && exactMass ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOdd),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "Exact mass: "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: `${parseFloat(exactMass).toFixed(6)} g/mol`
        })]
      }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(SECData, {
        classes: classes,
        layout: layoutSt,
        detector: selectedDetector,
        secData: secData
      }), !molSvg ? null : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactSvgFileZoomPan.default, {
        svg: molSvg,
        duration: 300,
        resize: true
      }), _format.default.isHplcUvVisLayout(layoutSt) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: (0, _classnames.default)(classes.rowRoot, classes.rowOddSim),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tHead, 'txt-sv-panel-txt'),
          children: "Area under curve (AUC):"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt'),
          children: aucValue(integration)
        })]
      }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(DSCData, {
        classes: classes,
        layout: layoutSt,
        dscMetaData: dscMetaData,
        updateAction: updateDSCMetaDataAct
      }), !editorOnly && _format.default.isNmrLayout(layoutSt) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.subSectionHeader,
          children: simTitle()
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: (0, _classnames.default)(classes.rowRoot, classes.rowOddSim),
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt'),
            children: simContent(simulationSt.nmrSimPeaks)
          })
        })]
      }) : null, !_format.default.isCyclicVoltaLayout(layoutSt) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.subSectionHeader,
          children: "Content"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: classes.quillContainer,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactQuill.default, {
            value: normalizeQuillValue(descriptions),
            placeholder: canChangeDescription ? 'Add text here...' : undefined,
            readOnly: !canChangeDescription,
            modules: {
              toolbar: false
            },
            onChange: value => handleDescriptionChanged(value, onDescriptionChanged)
          })
        })]
      }) : null]
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  simulationSt: state.simulation,
  shiftSt: state.shift,
  curveSt: state.curve,
  detectorSt: state.detector,
  metaSt: state.meta
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  updateDSCMetaDataAct: _meta.updateDSCMetaData
}, dispatch);
InfoPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  feature: _propTypes.default.object.isRequired,
  integration: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  descriptions: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]).isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  simulationSt: _propTypes.default.array.isRequired,
  shiftSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  exactMass: _propTypes.default.string,
  detectorSt: _propTypes.default.object.isRequired,
  metaSt: _propTypes.default.object.isRequired,
  updateDSCMetaDataAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(InfoPanel)); // eslint-disable-line