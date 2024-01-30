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
var _cfg = _interopRequireDefault(require("../../helpers/cfg"));
var _common = require("./common");
/* eslint-disable prefer-object-spread */

const styles = () => Object.assign({
  btnYes: {
    color: 'green'
  },
  btnNo: {
    color: 'red'
  },
  btnTxtConfirm: {
    fontFamily: 'Helvetica',
    fontSize: 12
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
    const title = /*#__PURE__*/_react.default.createElement("span", {
      className: "txt-sv-tp"
    }, tp);
    return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
      title: title
    }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_common.MuButton, {
      className: (0, _classnames.default)('btn-sv-bar-one'),
      disabled: isClearAllDisabled === false ? false : _cfg.default.btnCmdMpy(layoutSt) && _cfg.default.btnCmdIntg(layoutSt),
      onClick: this.onToggle
    }, children)));
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
    return /*#__PURE__*/_react.default.createElement("span", {
      disabled: _cfg.default.btnCmdMpy(layoutSt) && _cfg.default.btnCmdIntg(layoutSt)
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtLabel, 'txt-sv-bar-desc')
    }, "Delete ALL?"), /*#__PURE__*/_react.default.createElement(_common.MuButton, {
      className: (0, _classnames.default)('btn-sv-bar-yes'),
      onClick: onExec
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txt, classes.btnYes, 'txt-sv-bar-yes')
    }, "Y")), /*#__PURE__*/_react.default.createElement(_common.MuButton, {
      className: (0, _classnames.default)('btn-sv-bar-no'),
      onClick: this.onToggle
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txt, classes.btnNo, 'txt-sv-bar-no')
    }, "N")));
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