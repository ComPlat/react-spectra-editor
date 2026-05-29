"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveElnContent = exports.normalizeQuillValue = exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/function-component-definition, react/require-default-props,
react/no-danger, no-nested-ternary */

const normalizeQuillValue = val => {
  if (!val) return '';
  if (val === '<p><br></p>' || val === '<p></p>') return '';
  return val;
};
exports.normalizeQuillValue = normalizeQuillValue;
const toQuillHtml = val => {
  const normalized = normalizeQuillValue(val);
  if (!normalized) return '';
  if (normalized.includes('<')) return normalized;
  return normalized.split('\n').filter(line => line.length > 0).map(line => `<p>${line}</p>`).join('');
};
const resolveElnContent = (desc, descChanged) => {
  const edited = normalizeQuillValue(descChanged);
  if (edited) return edited;
  return toQuillHtml(desc);
};
exports.resolveElnContent = resolveElnContent;
const styles = () => ({
  root: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    margin: '6px 12px 10px',
    maxWidth: 1180
  },
  headerRow: {
    alignItems: 'baseline',
    display: 'flex',
    gap: 8,
    marginBottom: 4
  },
  sectionHeader: {
    color: '#66727c',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase'
  },
  sectionHint: {
    color: '#a8b0b8',
    fontSize: '0.65rem'
  },
  contentBody: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e6e8eb',
    borderRadius: 6,
    maxHeight: 88,
    minHeight: 28,
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '5px 10px',
    scrollbarColor: '#cbd5df transparent',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: 4,
      width: 5
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd5df',
      borderRadius: 4
    }
  },
  contentText: {
    color: '#25313b',
    fontSize: '0.78rem',
    lineHeight: 1.35,
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    '& p': {
      margin: '0 0 2px'
    },
    '& p:last-child': {
      marginBottom: 0
    }
  },
  placeholder: {
    color: '#a8b0b8',
    fontSize: '0.75rem',
    fontStyle: 'italic',
    lineHeight: 1.35
  }
});
const StandaloneContentPanel = ({
  classes,
  desc,
  descChanged
}) => {
  const content = resolveElnContent(desc, descChanged);
  const isEmpty = !content;
  const isHtml = content.includes('<');
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.root,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.headerRow,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: classes.sectionHeader,
        children: "Content"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: classes.sectionHint,
        children: "ELN field"
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.contentBody,
      children: isEmpty ? /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: classes.placeholder,
        children: "Write peaks or edit panel content\u2026"
      }) : isHtml ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.contentText,
        dangerouslySetInnerHTML: {
          __html: content
        }
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: classes.contentText,
        children: content
      })
    })]
  });
};
StandaloneContentPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  desc: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
  descChanged: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array])
};
var _default = exports.default = (0, _styles.withStyles)(styles)(StandaloneContentPanel);