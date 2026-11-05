"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _ScopedCssBaseline = _interopRequireDefault(require("@mui/material/ScopedCssBaseline"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _styles = require("@mui/material/styles");
var _content = _interopRequireDefault(require("./components/content"));
var _input_mol = _interopRequireDefault(require("./components/input_mol"));
var _input_file = _interopRequireDefault(require("./components/input_file"));
var _input_form = _interopRequireDefault(require("./components/input_form"));
var _input_pred_json = _interopRequireDefault(require("./components/input_pred_json"));
var _loading = _interopRequireDefault(require("./components/loading"));
var _notice = _interopRequireDefault(require("./components/notice"));
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/jsx-indent */

// A sans-serif system font for the page. ScopedCssBaseline applies it, and MUI's baseline,
// to this page's own subtree only, never to a host page.
const theme = (0, _styles.createTheme)({
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  }
});
const styles = () => ({
  page: {
    backgroundColor: '#fff',
    padding: '16px 24px'
  },
  // The inputs and Submit in one row that wraps on narrow windows.
  inputBar: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12
  },
  slotWide: {
    flex: '2 1 240px',
    minWidth: 0
  },
  slotNarrow: {
    flex: '1 1 200px',
    minWidth: 0
  },
  slotText: {
    color: '#52606d',
    flex: '3 1 320px',
    fontSize: 14,
    lineHeight: 1.5,
    margin: 0
  }
});
function FullVersion({
  classes
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.inputBar,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.slotWide,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_mol.default, {})
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.slotWide,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_file.default, {})
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.slotNarrow,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_pred_json.default, {})
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_form.default, {})]
  });
}
FullVersion.propTypes = {
  classes: _propTypes.default.object.isRequired
};
const editortext = classes => /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
  className: (0, _classnames.default)(classes.slotText, 'txt-sv-etext'),
  children: "Add a spectrum file (*.dx, *.jdx, *.JCAMP, *.zip from Bruker, *.RAW from Thermo Fisher, *.mz(X)ML) and click Submit. One 1D spectrum at a time; 2D spectra are not supported."
});
function EditorVersion({
  classes
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.inputBar,
    children: [editortext(classes), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes.slotWide,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_file.default, {})
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_form.default, {})]
  });
}
EditorVersion.propTypes = {
  classes: _propTypes.default.object.isRequired
};
function Frame({
  classes,
  editorOnly
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_styles.ThemeProvider, {
    theme: theme,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ScopedCssBaseline.default, {
      className: classes.page,
      children: [editorOnly ? /*#__PURE__*/(0, _jsxRuntime.jsx)(EditorVersion, {
        classes: classes
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(FullVersion, {
        classes: classes
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_content.default, {
        editorOnly: editorOnly
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_notice.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_loading.default, {})]
    })
  });
}
Frame.propTypes = {
  classes: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired
};
var _default = exports.default = (0, _withStyles.default)(styles)(Frame);