"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/styles");
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _CheckRounded = _interopRequireDefault(require("@mui/icons-material/CheckRounded"));
var _CloseRounded = _interopRequireDefault(require("@mui/icons-material/CloseRounded"));
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread */

const styles = () => Object.assign({
  btnYes: {
    backgroundColor: '#eef8f0',
    borderColor: '#9ccfa7',
    color: '#1f7a35',
    '&:hover': {
      backgroundColor: '#dff2e3',
      borderColor: '#6fb980'
    }
  },
  btnNo: {
    backgroundColor: '#fff1f0',
    borderColor: '#efb0aa',
    color: '#b42318',
    '&:hover': {
      backgroundColor: '#ffe3e0',
      borderColor: '#df8379'
    }
  },
  btnTxtConfirm: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 12
  },
  confirmWrap: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #dbe3ea',
    borderRadius: 7,
    display: 'inline-flex',
    gap: 4,
    height: 30,
    padding: '0 4px 0 8px'
  },
  confirmText: {
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.02em',
    marginRight: 2,
    whiteSpace: 'nowrap'
  },
  confirmBtn: {
    height: 24,
    minWidth: 24,
    width: 24
  },
  confirmIcon: {
    fontSize: 17
  }
}, _common.commonStyle);
class TriBtn extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false
    };
    this.onToggle = this.onToggle.bind(this);
    this.renderStageOne = this.renderStageOne.bind(this);
    this.renderStageTwo = this.renderStageTwo.bind(this);
  }
  onToggle(e) {
    e.stopPropagation();
    e.preventDefault();
    const {
      toggled
    } = this.state;
    this.setState({
      toggled: !toggled
    });
  }
  renderStageOne() {
    const {
      content,
      layoutSt,
      children,
      isClearAllDisabled
    } = this.props;
    const {
      tp
    } = content;
    const title = /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: "txt-sv-tp",
      children: tp
    });
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: title,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: (0, _classnames.default)('btn-sv-bar-one'),
          disabled: isClearAllDisabled === false ? false : _cfg.default.btnCmdMpy(layoutSt) && _cfg.default.btnCmdIntg(layoutSt),
          onClick: this.onToggle,
          children: children
        })
      })
    });
  }
  renderStageTwo() {
    const {
      classes,
      layoutSt,
      cb
    } = this.props;
    const onExec = e => {
      cb();
      this.onToggle(e);
    };
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
      className: classes.confirmWrap,
      disabled: _cfg.default.btnCmdMpy(layoutSt) && _cfg.default.btnCmdIntg(layoutSt),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: (0, _classnames.default)(classes.confirmText, 'txt-sv-bar-desc'),
        children: "Delete ALL?"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: (0, _classnames.default)(classes.confirmBtn, classes.btnYes, 'btn-sv-bar-yes'),
        onClick: onExec,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CheckRounded.default, {
          className: (0, _classnames.default)(classes.confirmIcon, 'txt-sv-bar-yes')
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
        className: (0, _classnames.default)(classes.confirmBtn, classes.btnNo, 'btn-sv-bar-no'),
        onClick: this.onToggle,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CloseRounded.default, {
          className: (0, _classnames.default)(classes.confirmIcon, 'txt-sv-bar-no')
        })
      })]
    });
  }
  render() {
    const {
      toggled
    } = this.state;
    return !toggled ? this.renderStageOne() : this.renderStageTwo();
  }
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
TriBtn.propTypes = {
  classes: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  content: _propTypes.default.object.isRequired,
  cb: _propTypes.default.func.isRequired,
  children: _propTypes.default.node.isRequired,
  isClearAllDisabled: _propTypes.default.bool.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(TriBtn));