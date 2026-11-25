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
var _reactDropzone = _interopRequireDefault(require("react-dropzone"));
var _classnames = _interopRequireDefault(require("classnames"));
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _styles = require("./styles");
var _action_file = require("../actions/action_file");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/jsx-props-no-spreading */

const styles = () => ({
  baseDD: _styles.dropBox,
  hint: _styles.hint
});
const tpHint = classes => /*#__PURE__*/(0, _jsxRuntime.jsxs)("ul", {
  className: (0, _classnames.default)(classes.hint, 'txt-sv-tp'),
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("li", {
    children: "*.dx, *.jdx, *.JCAMP, *.RAW, *.mz(X)ML, *.cdf"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("li", {
    children: "*.zip (Bruker FID folder)"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("li", {
    children: "up to 200 MB"
  })]
});
const msgDefault = 'Add Spectrum';
const content = (classes, desc) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
  title: tpHint(classes),
  placement: "bottom",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    children: desc
  })
});
function InputFile({
  classes,
  srcFileSt,
  addFileInitAct
}) {
  const fileName = srcFileSt && srcFileSt.name;
  const onDrop = files => addFileInitAct({
    file: files[0]
  });
  const desc = fileName || msgDefault;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactDropzone.default, {
    className: "dropbox",
    onDrop: onDrop,
    disabled: false,
    children: ({
      getRootProps,
      getInputProps
    }) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      ...getRootProps(),
      className: classes.baseDD,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        ...getInputProps()
      }), content(classes, desc)]
    })
  });
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  srcFileSt: state.file.src
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  addFileInitAct: _action_file.addFileInit
}, dispatch);
InputFile.propTypes = {
  classes: _propTypes.default.object.isRequired,
  srcFileSt: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.bool]).isRequired,
  addFileInitAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(InputFile));