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
var _withStyles = _interopRequireDefault(require("@mui/styles/withStyles"));
var _material = require("@mui/material");
var _jsxRuntime = require("react/jsx-runtime");
const styles = () => ({
  card: {
    alignItems: 'center',
    display: 'flex',
    gap: 16,
    padding: '20px 28px'
  }
});

// A steady spinner: the default one grows and shrinks its arc, which reads as starting over
// during a long conversion.
function Loading({
  loadingSt,
  classes
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Dialog, {
    open: loadingSt,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.card,
      role: "status",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.CircularProgress, {
        disableShrink: true,
        size: 32,
        thickness: 4
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Typography, {
        sx: {
          color: '#3e4c59',
          fontSize: 15
        },
        children: "Processing\u2026"
      })]
    })
  });
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  loadingSt: state.loading
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
Loading.propTypes = {
  loadingSt: _propTypes.default.bool.isRequired,
  classes: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _withStyles.default)(styles)(Loading));