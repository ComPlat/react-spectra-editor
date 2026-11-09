"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _redux = require("redux");
var _reactRedux = require("react-redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _colors = require("@mui/material/colors");
var _CheckCircle = _interopRequireDefault(require("@mui/icons-material/CheckCircle"));
var _Warning = _interopRequireDefault(require("@mui/icons-material/Warning"));
var _Error = _interopRequireDefault(require("@mui/icons-material/Error"));
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _action_notice = require("../actions/action_notice");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/jsx-props-no-spreading */

const stylesBar = theme => ({
  success: {
    backgroundColor: _colors.green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: _colors.amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});
const variantIcon = {
  success: _CheckCircle.default,
  warning: _Warning.default,
  error: _Error.default,
  info: _Info.default
};
function BarContent(props) {
  const {
    classes,
    className,
    message,
    onClose,
    variant,
    open,
    ...other
  } = props;
  const Icon = variantIcon[variant];
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Snackbar, {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    },
    open: open,
    autoHideDuration: 6000,
    onClose: onClose,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.SnackbarContent, {
      className: (0, _classnames.default)(classes[variant], className),
      "aria-describedby": "client-snackbar",
      message: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
        id: "client-snackbar",
        className: (0, _classnames.default)(classes.message, 'txt-notice'),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(Icon, {
          className: (0, _classnames.default)(classes.icon, classes.iconVariant)
        }), message]
      }),
      action: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.IconButton, {
        "aria-label": "Close",
        color: "inherit",
        className: classes.close,
        onClick: onClose,
        size: "large",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Close.default, {
          className: classes.icon
        })
      }, "close")],
      ...other
    })
  });
}
BarContent.propTypes = {
  classes: _propTypes.default.object.isRequired,
  className: _propTypes.default.string.isRequired,
  message: _propTypes.default.node.isRequired,
  onClose: _propTypes.default.func.isRequired,
  open: _propTypes.default.bool.isRequired,
  variant: _propTypes.default.oneOf(['success', 'warning', 'error', 'info']).isRequired
};
const BarContentWrapper = (0, _styles.withStyles)(stylesBar)(BarContent);

// - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// Notice
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - -
const stylesNotice = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
});
function BarContentMain(variant, className, message, open, onClose) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(BarContentWrapper, {
    variant: variant,
    className: className,
    message: message,
    open: open,
    onClose: onClose
  });
}
function Notice({
  classes,
  noticeSt,
  manualClearAct
}) {
  const {
    status,
    message
  } = noticeSt;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: status && message ? BarContentMain(status, classes.margin, message, Boolean(status), manualClearAct) : null
  });
}
const mapStateToProps = state => ({
  noticeSt: state.notice
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  manualClearAct: _action_notice.manualClear
}, dispatch);
Notice.propTypes = {
  classes: _propTypes.default.object.isRequired,
  noticeSt: _propTypes.default.object.isRequired,
  manualClearAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _redux.compose)((0, _styles.withStyles)(stylesNotice), (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(Notice);