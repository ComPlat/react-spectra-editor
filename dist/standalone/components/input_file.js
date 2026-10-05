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
var _action_file = require("../actions/action_file");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/jsx-props-no-spreading */

const styles = () => ({
  root: {
    flexGrow: 1
  },
  baseDD: {
    borderRadius: 5,
    height: 30,
    lineHeight: '30px',
    margin: '0 0 10px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%'
  },
  enableDD: {
    border: '2px dashed #000',
    color: '#000'
  },
  disableDD: {
    border: '2px dashed #aaa',
    color: '#aaa'
  },
  tpCard: {},
  tpMoreTxt: {
    padding: '0 0 0 60px'
  },
  tpLabel: {
    fontSize: 16
  }
});
const tpHint = classes => /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
  className: (0, _classnames.default)(classes.tpCard),
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: "- Accept *.dx, *.jdx, *.JCAMP,"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, classes.tpMoreTxt, 'txt-sv-tp'),
    children: "*.RAW, *.mz(X)ML, *.cdf,"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, classes.tpMoreTxt, 'txt-sv-tp'),
    children: "*.zip (Bruker FID folder)"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: "- Max 30Mb"
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
  editorOnly,
  srcMolSt,
  srcFileSt,
  addFileInitAct
}) {
  const fileName = srcFileSt && srcFileSt.name;
  const onDrop = files => addFileInitAct({
    file: files[0]
  });
  const enabled = editorOnly || srcMolSt;
  const addOnCls = enabled ? classes.enableDD : classes.disableDD;
  const desc = fileName || msgDefault;
  return (
    /*#__PURE__*/
    // <Dropzone
    //   className="dropbox"
    //   onDrop={onDrop}
    //   disabled={!enabled}
    // >
    (0, _jsxRuntime.jsx)(_reactDropzone.default, {
      className: "dropbox",
      onDrop: onDrop,
      disabled: false,
      children: ({
        getRootProps,
        getInputProps
      }) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        ...getRootProps(),
        className: (0, _classnames.default)(classes.baseDD, addOnCls),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          ...getInputProps()
        }), content(classes, desc)]
      })
    })
  );
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  srcMolSt: state.mol.src,
  srcFileSt: state.file.src
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  addFileInitAct: _action_file.addFileInit
}, dispatch);
InputFile.propTypes = {
  classes: _propTypes.default.object.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  srcMolSt: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.bool]).isRequired,
  srcFileSt: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.bool]).isRequired,
  addFileInitAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(InputFile));