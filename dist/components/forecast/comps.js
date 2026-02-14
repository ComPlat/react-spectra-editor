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
var _jsxRuntime = require("react/jsx-runtime");
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
const TxtLabel = exports.TxtLabel = function TxtLabel(classes, label) {
  let extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-label';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: (0, _classnames.default)(classes.txtLabel, extClsName),
    children: label
  });
};
const StatusIcon = status => {
  switch (status) {
    case 'accept':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Accept"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CheckCircleOutline.default, {
          style: {
            color: '#4caf50'
          }
        })
      });
    case 'warning':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Warning"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorOutline.default, {
          style: {
            color: '#ffc107'
          }
        })
      });
    case 'reject':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Reject"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
          style: {
            color: '#e91e63'
          }
        })
      });
    case 'missing':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Missing"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutline.default, {
          style: {
            color: '#5d4037'
          }
        })
      });
    case 'unknown':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Not Support"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Help.default, {
          style: {
            color: '#5d4037'
          }
        })
      });
    default:
      return null;
  }
};
exports.StatusIcon = StatusIcon;
const ConfidenceLabel = exports.ConfidenceLabel = function ConfidenceLabel(classes, confidence) {
  let extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-label';
  if (!confidence) return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    children: " - - "
  });
  const confidenceDp = parseFloat(Math.round(confidence * 100) / 100).toFixed(2);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: (0, _classnames.default)(classes.txtLabel, extClsName),
    children: `${confidenceDp} %`
  });
};
const sectionInput = (classes, molecule, inputFuncCb) => {
  if (!inputFuncCb) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: (0, _classnames.default)(classes.inputRoot),
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Grid, {
      container: true,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Grid, {
        item: true,
        xs: 6,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TextField, {
          fullWidth: true,
          label: TxtLabel(classes, 'Molfile', 'txt-mol-label'),
          margin: "normal",
          multiline: true,
          onChange: inputFuncCb,
          rows: "2",
          variant: "outlined",
          value: molecule
        })
      })
    })
  });
};
exports.sectionInput = sectionInput;
const SectionRunning = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
  style: titleStyle,
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("h2", {
    style: txtStyle,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.CircularProgress, {
      style: {
        color: 'blue',
        fontSize: 50
      }
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "The server is making predictions..."
    })]
  })
});
const SectionMissMatch = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
  style: titleStyle,
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("h2", {
    style: txtStyle,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorOutline.default, {
      style: {
        color: 'red',
        fontSize: 50
      }
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      className: "txt-predict-fail",
      children: "Peak & Element count mismatch!"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
      className: "txt-predict-fail",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
        children: "1"
      }), "H multiplicity count should not be more than the proton group count. Multiplicity must be assigned manulally before predictions."]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
      className: "txt-predict-fail",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
        children: "13"
      }), "C peak count should not be more than the carbon count, and solvent peaks should be excluded."]
    })]
  })
});
const SectionNoService = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
  style: titleStyle,
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("h2", {
    style: txtStyle,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_CloudOff.default, {
      style: {
        color: 'red',
        fontSize: 50
      }
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "Service is not available."
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "Please try it again later."
    })]
  })
});
const SectionUnknown = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
  style: titleStyle,
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("h2", {
    style: txtStyle,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutline.default, {
      style: {
        color: 'purple',
        fontSize: 50
      }
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "Unknown state."
    })]
  })
});
const notToRenderAnalysis = pds => {
  if (pds.running) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionRunning, {});
  if (!pds.outline || !pds.outline.code) return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {});
  if (pds.outline.code >= 500) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionNoService, {});
  if (pds.outline.code === 400) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionMissMatch, {});
  if (pds.outline.code >= 300) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionUnknown, {});
  return false;
};
exports.notToRenderAnalysis = notToRenderAnalysis;
const sectionSvg = (classes, predictions) => {
  const renderMsg = notToRenderAnalysis(predictions);
  if (renderMsg) return null;
  if (!predictions.output) return null;
  const targetSvg = predictions.output.result[0].svgs[0];
  if (!targetSvg) return /*#__PURE__*/(0, _jsxRuntime.jsx)(_section_loading.default, {});
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactSvgFileZoomPan.default, {
    svg: targetSvg,
    duration: 300,
    resize: true
  });
};
exports.sectionSvg = sectionSvg;