"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sectionSvg = exports.sectionInput = exports.notToRenderAnalysis = exports.TxtLabel = exports.StatusIcon = exports.ConfidenceLabel = void 0;
var _react = _interopRequireDefault(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactSvgFileZoomPan = _interopRequireDefault(require("@complat/react-svg-file-zoom-pan"));
var _CheckCircleOutline = _interopRequireDefault(require("@mui/icons-material/CheckCircleOutline"));
var _ErrorOutline = _interopRequireDefault(require("@mui/icons-material/ErrorOutline"));
var _HighlightOff = _interopRequireDefault(require("@mui/icons-material/HighlightOff"));
var _HelpOutline = _interopRequireDefault(require("@mui/icons-material/HelpOutline"));
var _Help = _interopRequireDefault(require("@mui/icons-material/Help"));
var _material = require("@mui/material");
var _CloudOff = _interopRequireDefault(require("@mui/icons-material/CloudOff"));
var _section_loading = _interopRequireDefault(require("./section_loading"));
/* eslint-disable react/function-component-definition, react/destructuring-assignment,
max-len */

const titleStyle = {
  backgroundColor: '#f5f5f5',
  border: '2px solid #e3e3e3',
  borderRadius: '10px',
  lineHeight: '200px',
  marginBottom: 10,
  marginTop: 10,
  marginLeft: 40,
  textAlign: 'center',
  width: '70%'
};
const txtStyle = {
  lineHeight: '20px'
};
const TxtLabel = (classes, label, extClsName = 'txt-label') => /*#__PURE__*/_react.default.createElement("span", {
  className: (0, _classnames.default)(classes.txtLabel, extClsName)
}, label);
exports.TxtLabel = TxtLabel;
const StatusIcon = status => {
  switch (status) {
    case 'accept':
      return /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
        title: /*#__PURE__*/_react.default.createElement("span", {
          className: "txt-sv-tp"
        }, "Accept"),
        placement: "left"
      }, /*#__PURE__*/_react.default.createElement(_CheckCircleOutline.default, {
        style: {
          color: '#4caf50'
        }
      }));
    case 'warning':
      return /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
        title: /*#__PURE__*/_react.default.createElement("span", {
          className: "txt-sv-tp"
        }, "Warning"),
        placement: "left"
      }, /*#__PURE__*/_react.default.createElement(_ErrorOutline.default, {
        style: {
          color: '#ffc107'
        }
      }));
    case 'reject':
      return /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
        title: /*#__PURE__*/_react.default.createElement("span", {
          className: "txt-sv-tp"
        }, "Reject"),
        placement: "left"
      }, /*#__PURE__*/_react.default.createElement(_HighlightOff.default, {
        style: {
          color: '#e91e63'
        }
      }));
    case 'missing':
      return /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
        title: /*#__PURE__*/_react.default.createElement("span", {
          className: "txt-sv-tp"
        }, "Missing"),
        placement: "left"
      }, /*#__PURE__*/_react.default.createElement(_HelpOutline.default, {
        style: {
          color: '#5d4037'
        }
      }));
    case 'unknown':
      return /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
        title: /*#__PURE__*/_react.default.createElement("span", {
          className: "txt-sv-tp"
        }, "Not Support"),
        placement: "left"
      }, /*#__PURE__*/_react.default.createElement(_Help.default, {
        style: {
          color: '#5d4037'
        }
      }));
    default:
      return null;
  }
};
exports.StatusIcon = StatusIcon;
const ConfidenceLabel = (classes, confidence, extClsName = 'txt-label') => {
  if (!confidence) return /*#__PURE__*/_react.default.createElement("span", null, " - - ");
  const confidenceDp = parseFloat(Math.round(confidence * 100) / 100).toFixed(2);
  return /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtLabel, extClsName)
  }, `${confidenceDp} %`);
};
exports.ConfidenceLabel = ConfidenceLabel;
const sectionInput = (classes, molecule, inputFuncCb) => {
  if (!inputFuncCb) return null;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.inputRoot)
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 6
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    fullWidth: true,
    label: TxtLabel(classes, 'Molfile', 'txt-mol-label'),
    margin: "normal",
    multiline: true,
    onChange: inputFuncCb,
    rows: "2",
    variant: "outlined",
    value: molecule
  }))));
};
exports.sectionInput = sectionInput;
const SectionRunning = () => /*#__PURE__*/_react.default.createElement("div", {
  style: titleStyle
}, /*#__PURE__*/_react.default.createElement("h2", {
  style: txtStyle
}, /*#__PURE__*/_react.default.createElement(_material.CircularProgress, {
  style: {
    color: 'blue',
    fontSize: 50
  }
}), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("p", null, "The server is making predictions...")));
const SectionMissMatch = () => /*#__PURE__*/_react.default.createElement("div", {
  style: titleStyle
}, /*#__PURE__*/_react.default.createElement("h2", {
  style: txtStyle
}, /*#__PURE__*/_react.default.createElement(_ErrorOutline.default, {
  style: {
    color: 'red',
    fontSize: 50
  }
}), /*#__PURE__*/_react.default.createElement("p", {
  className: "txt-predict-fail"
}, "Peak & Element count mismatch!"), /*#__PURE__*/_react.default.createElement("p", {
  className: "txt-predict-fail"
}, /*#__PURE__*/_react.default.createElement("sup", null, "1"), "H multiplicity count should not be more than the proton group count. Multiplicity must be assigned manulally before predictions."), /*#__PURE__*/_react.default.createElement("p", {
  className: "txt-predict-fail"
}, /*#__PURE__*/_react.default.createElement("sup", null, "13"), "C peak count should not be more than the carbon count, and solvent peaks should be excluded.")));
const SectionNoService = () => /*#__PURE__*/_react.default.createElement("div", {
  style: titleStyle
}, /*#__PURE__*/_react.default.createElement("h2", {
  style: txtStyle
}, /*#__PURE__*/_react.default.createElement(_CloudOff.default, {
  style: {
    color: 'red',
    fontSize: 50
  }
}), /*#__PURE__*/_react.default.createElement("p", null, "Service is not available."), /*#__PURE__*/_react.default.createElement("p", null, "Please try it again later.")));
const SectionUnknown = () => /*#__PURE__*/_react.default.createElement("div", {
  style: titleStyle
}, /*#__PURE__*/_react.default.createElement("h2", {
  style: txtStyle
}, /*#__PURE__*/_react.default.createElement(_HelpOutline.default, {
  style: {
    color: 'purple',
    fontSize: 50
  }
}), /*#__PURE__*/_react.default.createElement("p", null, "Unknown state.")));
const notToRenderAnalysis = pds => {
  if (pds.running) return /*#__PURE__*/_react.default.createElement(SectionRunning, null);
  if (!pds.outline || !pds.outline.code) return /*#__PURE__*/_react.default.createElement("div", null);
  if (pds.outline.code >= 500) return /*#__PURE__*/_react.default.createElement(SectionNoService, null);
  if (pds.outline.code === 400) return /*#__PURE__*/_react.default.createElement(SectionMissMatch, null);
  if (pds.outline.code >= 300) return /*#__PURE__*/_react.default.createElement(SectionUnknown, null);
  return false;
};
exports.notToRenderAnalysis = notToRenderAnalysis;
const sectionSvg = (classes, predictions) => {
  const renderMsg = notToRenderAnalysis(predictions);
  if (renderMsg) return null;
  if (!predictions.output) return null;
  const targetSvg = predictions.output.result[0].svgs[0];
  if (!targetSvg) return /*#__PURE__*/_react.default.createElement(_section_loading.default, null);
  return /*#__PURE__*/_react.default.createElement(_reactSvgFileZoomPan.default, {
    svg: targetSvg,
    duration: 300,
    resize: true
  });
};
exports.sectionSvg = sectionSvg;