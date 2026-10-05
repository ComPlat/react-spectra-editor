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
var _action_predict = require("../actions/action_predict");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/jsx-props-no-spreading */

const styles = () => ({
  root: {
    flexGrow: 1
  },
  baseDD: {
    border: '2px dashed #aaa',
    borderRadius: 5,
    height: 30,
    lineHeight: '30px',
    margin: '0 0 10px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%'
  },
  tpCard: {},
  tpLabel: {
    fontSize: 16
  },
  tpContent: {
    color: '#aaa'
  }
});
const tpHint = classes => /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
  className: (0, _classnames.default)(classes.tpCard),
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: "- OPTIONAL"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: "- Accept *.json"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
    className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp'),
    children: "- Max 30Mb"
  })]
});
const msgDefault = '(Optional) Add Prediction';
const msgExist = 'Predicted';
const content = (classes, desc) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
  title: tpHint(classes),
  placement: "bottom",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: (0, _classnames.default)(classes.tpContent),
    children: desc
  })
});
function InputPredJson({
  classes,
  addPredJsonInitAct,
  predictSt
}) {
  const hasPredict = predictSt.output.result.length !== 0;
  const desc = hasPredict ? msgExist : msgDefault;
  const onDrop = files => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const str = reader.result;
      addPredJsonInitAct(JSON.parse(str));
    };
    reader.readAsBinaryString(file);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactDropzone.default, {
    className: "dropbox",
    onDrop: onDrop,
    children: ({
      getRootProps,
      getInputProps
    }) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      ...getRootProps(),
      className: (0, _classnames.default)(classes.baseDD),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        ...getInputProps()
      }), content(classes, desc)]
    })
  });
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  predictSt: state.predict
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  addPredJsonInitAct: _action_predict.addPredJsonInit
}, dispatch);
InputPredJson.propTypes = {
  classes: _propTypes.default.object.isRequired,
  predictSt: _propTypes.default.object.isRequired,
  addPredJsonInitAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(InputPredJson));