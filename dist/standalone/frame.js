"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
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

const theme = (0, _styles.createTheme)();
const styles = () => ({
  root: {
    flexGrow: 1
  }
});
function FullVersion({
  classes,
  editorOnly
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
    container: true,
    className: classes.root,
    spacing: 10,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 1
    }, "grid-drop-space"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 4,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_mol.default, {})
    }, "grid-drop-mol"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 4,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_file.default, {
        editorOnly: editorOnly
      })
    }, "grid-drop-file"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 2,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_pred_json.default, {})
    }, "grid-drop-pred-json"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 1,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_form.default, {})
    }, "grid-form-input")]
  });
}
FullVersion.propTypes = {
  classes: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired
};
const editortext = classes => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
  className: (0, _classnames.default)(classes.etSpan, 'txt-sv-etext'),
  children: "(1) Upload a spectrum file to the dashed box on the right. Valid formats: *.dx, *.jdx, *.JCAMP, *.fid, *.zip (Bruker), *.RAW (ThermoFisher), *.mz(X)ML. A 2D spectrum is NOT available. One spectrum only, not several in parallel. (2) Click the submit button"
});
function EditorVersion({
  classes,
  editorOnly
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
    container: true,
    className: classes.root,
    spacing: 24,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 1
    }, "grid-drop-space"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 7,
      children: editortext(classes)
    }, "grid-drop-mol"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 2,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_file.default, {
        editorOnly: editorOnly
      })
    }, "grid-drop-file"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 1,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_input_form.default, {})
    }, "grid-form-input"), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
      item: true,
      xs: 1
    }, "grid-drop-space")]
  });
}
EditorVersion.propTypes = {
  classes: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired
};
function Frame({
  classes,
  editorOnly
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_styles.ThemeProvider, {
    theme: theme,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [editorOnly ? /*#__PURE__*/(0, _jsxRuntime.jsx)(EditorVersion, {
        classes: classes,
        editorOnly: editorOnly
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(FullVersion, {
        classes: classes,
        editorOnly: editorOnly
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