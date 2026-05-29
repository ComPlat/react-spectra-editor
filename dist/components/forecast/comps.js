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
max-len, react/prop-types */

const TxtLabel = (classes, label, extClsName = 'txt-label') => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
  className: (0, _classnames.default)(classes.txtLabel, extClsName),
  children: label
});
exports.TxtLabel = TxtLabel;
const statusBadgeClass = (classes, status) => {
  switch (status) {
    case 'accept':
      return classes.statusAccept;
    case 'warning':
      return classes.statusWarning;
    case 'reject':
      return classes.statusReject;
    case 'missing':
      return classes.statusMissing;
    case 'unknown':
      return classes.statusUnknown;
    default:
      return classes.statusUnknown;
  }
};
const StatusIcon = (classes, status) => {
  const badgeCls = (0, _classnames.default)(classes.statusBadge, statusBadgeClass(classes, status));
  switch (status) {
    case 'accept':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Accept"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: badgeCls,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CheckCircleOutline.default, {
            style: {
              color: '#4caf50',
              fontSize: 18
            }
          })
        })
      });
    case 'warning':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Warning"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: badgeCls,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorOutline.default, {
            style: {
              color: '#ffc107',
              fontSize: 18
            }
          })
        })
      });
    case 'reject':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Reject"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: badgeCls,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
            style: {
              color: '#e91e63',
              fontSize: 18
            }
          })
        })
      });
    case 'missing':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Missing"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: badgeCls,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutline.default, {
            style: {
              color: '#795548',
              fontSize: 18
            }
          })
        })
      });
    case 'unknown':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
        title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "txt-sv-tp",
          children: "Not Support"
        }),
        placement: "left",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: badgeCls,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Help.default, {
            style: {
              color: '#66727c',
              fontSize: 18
            }
          })
        })
      });
    default:
      return null;
  }
};
exports.StatusIcon = StatusIcon;
const ConfidenceLabel = (classes, confidence, extClsName = 'txt-label') => {
  if (!confidence) return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    children: " - - "
  });
  const confidenceDp = parseFloat(Math.round(confidence * 100) / 100).toFixed(2);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: (0, _classnames.default)(classes.txtLabel, extClsName),
    children: `${confidenceDp} %`
  });
};
exports.ConfidenceLabel = ConfidenceLabel;
const sectionInput = (classes, molecule, inputFuncCb) => {
  if (!inputFuncCb) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: (0, _classnames.default)(classes.inputSection),
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.sectionHeader,
      children: "Molfile"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TextField, {
      fullWidth: true,
      className: classes.molField,
      margin: "dense",
      multiline: true,
      onChange: inputFuncCb,
      placeholder: "Paste or edit molfile...",
      rows: 3,
      variant: "outlined",
      value: molecule
    })]
  });
};
exports.sectionInput = sectionInput;
const SectionRunning = ({
  classes
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  className: classes.messageBox,
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.CircularProgress, {
    size: 40,
    style: {
      color: '#2196f3'
    }
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: classes.messageText,
    children: "The server is making predictions..."
  })]
});
const SectionMissMatch = ({
  classes
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  className: classes.messageBox,
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ErrorOutline.default, {
    style: {
      color: '#e91e63',
      fontSize: 40
    }
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: classes.messageText,
    children: "Peak & element count mismatch!"
  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
    className: classes.messageSubText,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
      children: "1"
    }), "H multiplicity count should not be more than the proton group count. Multiplicity must be assigned manually before predictions."]
  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
    className: classes.messageSubText,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("sup", {
      children: "13"
    }), "C peak count should not be more than the carbon count, and solvent peaks should be excluded."]
  })]
});
const SectionNoService = ({
  classes
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  className: classes.messageBox,
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_CloudOff.default, {
    style: {
      color: '#e91e63',
      fontSize: 40
    }
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: classes.messageText,
    children: "Service is not available."
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: classes.messageSubText,
    children: "Please try again later."
  })]
});
const SectionUnknown = ({
  classes
}) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
  className: classes.messageBox,
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_HelpOutline.default, {
    style: {
      color: '#66727c',
      fontSize: 40
    }
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: classes.messageText,
    children: "Unknown state."
  })]
});
const notToRenderAnalysis = (pds, classes) => {
  if (pds.running) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionRunning, {
    classes: classes
  });
  if (!pds.outline || !pds.outline.code) return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {});
  if (pds.outline.code >= 500) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionNoService, {
    classes: classes
  });
  if (pds.outline.code === 400) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionMissMatch, {
    classes: classes
  });
  if (pds.outline.code >= 300) return /*#__PURE__*/(0, _jsxRuntime.jsx)(SectionUnknown, {
    classes: classes
  });
  return false;
};
exports.notToRenderAnalysis = notToRenderAnalysis;
const sectionSvg = (classes, predictions) => {
  const renderMsg = notToRenderAnalysis(predictions, classes);
  if (renderMsg) return null;
  if (!predictions.output) return null;
  const targetSvg = predictions.output.result[0].svgs[0];
  if (!targetSvg) return /*#__PURE__*/(0, _jsxRuntime.jsx)(_section_loading.default, {
    classes: classes
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactSvgFileZoomPan.default, {
    svg: targetSvg,
    duration: 300,
    resize: true
  });
};
exports.sectionSvg = sectionSvg;