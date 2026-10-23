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
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _util_file = require("../utils/util_file");
var _action_form = require("../actions/action_form");
var _jsxRuntime = require("react/jsx-runtime");
const styles = () => ({
  root: {
    float: 'left'
  },
  btnRefresh: {
    borderRadius: 5,
    height: 34,
    padding: '4px 10px 4px 10px'
  },
  icon: {}
});
const btnSubmit = (classes, isValidExt, submitFormAct) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
  disabled: !isValidExt,
  size: "small",
  variant: "fab",
  color: "primary",
  className: (0, _classnames.default)(classes.btnRefresh),
  onClick: submitFormAct,
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: (0, _classnames.default)(classes.subBtn, 'txt-sv-subBtn'),
    children: "Submit"
  })
});
function InputForm({
  classes,
  fileSt,
  submitFormAct
}) {
  const {
    src
  } = fileSt;
  const isValidMsExt = (0, _util_file.VerifyMsExt)(src);
  const isValidJcampExt = (0, _util_file.VerifyJcampExt)(src);
  const isValidExt = isValidMsExt || isValidJcampExt;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: (0, _classnames.default)(classes.root),
    children: btnSubmit(classes, isValidExt, submitFormAct)
  });
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  fileSt: state.file
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  submitFormAct: _action_form.submitForm
}, dispatch);
InputForm.propTypes = {
  fileSt: _propTypes.default.object.isRequired,
  submitFormAct: _propTypes.default.func.isRequired,
  classes: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(InputForm));