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
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _util_file = require("../utils/util_file");
var _action_form = require("../actions/action_form");
var _jsxRuntime = require("react/jsx-runtime");
// `sx`, not a JSS class: MUI's own button styles would otherwise win.
const btnSx = {
  borderRadius: '8px',
  fontSize: 15,
  height: 44,
  px: 3,
  textTransform: 'none'
};
const btnSubmit = (isValidExt, submitFormAct) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
  disabled: !isValidExt,
  variant: "contained",
  color: "primary",
  disableElevation: true,
  className: "txt-sv-subBtn",
  sx: btnSx,
  onClick: submitFormAct,
  children: "Submit"
});
function InputForm({
  fileSt,
  submitFormAct
}) {
  const {
    src
  } = fileSt;
  const isValidMsExt = (0, _util_file.VerifyMsExt)(src);
  const isValidJcampExt = (0, _util_file.VerifyJcampExt)(src);
  const isValidExt = isValidMsExt || isValidJcampExt;
  return btnSubmit(isValidExt, submitFormAct);
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
  submitFormAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(InputForm);