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
var _styles = require("@material-ui/core/styles");
var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));
var _InputAdornment = _interopRequireDefault(require("@material-ui/core/InputAdornment"));
var _multiplicity = require("../../actions/multiplicity");
const styles = () => ({
  jDiv: {
    height: 28
  },
  jTxt: {
    margin: '0 5px 4px 60px'
  },
  moExtTxt: {
    margin: '0 5px 0 5x',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica'
  },
  txtField: {
    width: 260,
    margin: '0 3px 0 3px'
  },
  txtInput: {
    color: 'white',
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
    height: 24
  }
});
const txtJ = () => /*#__PURE__*/_react.default.createElement(_InputAdornment.default, {
  position: "start"
}, /*#__PURE__*/_react.default.createElement("span", {
  className: "txt-cmd-j"
}, "J\xA0="));
const txtHz = () => /*#__PURE__*/_react.default.createElement(_InputAdornment.default, {
  position: "end"
}, /*#__PURE__*/_react.default.createElement("span", {
  className: "txt-cmd-hz"
}, "Hz"));
class MpyCoupling extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      tmpVal: false
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onFocus() {
    this.setState({
      focus: true
    });
  }
  onBlur() {
    const {
      row,
      updateMpyJAct
    } = this.props;
    const {
      tmpVal
    } = this.state;
    const {
      xExtent
    } = row;
    this.setState({
      focus: false,
      tmpVal: false
    });
    updateMpyJAct({
      xExtent,
      value: tmpVal
    });
  }
  onChange(e) {
    this.setState({
      tmpVal: e.target.value
    });
  }
  render() {
    const {
      classes,
      row
    } = this.props;
    const {
      focus,
      tmpVal
    } = this.state;
    const value = focus && (tmpVal || tmpVal === '') ? tmpVal : row.jStr;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)(classes.jDiv)
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.moExtTxt, classes.jTxt, 'txt-sv-panel-head')
    }, /*#__PURE__*/_react.default.createElement(_TextField.default, {
      className: (0, _classnames.default)(classes.txtField, 'txt-cmd-field'),
      placeholder: "-",
      value: value,
      margin: "none",
      InputProps: {
        startAdornment: txtJ(),
        endAdornment: txtHz(),
        className: (0, _classnames.default)(classes.txtInput, 'txt-sv-input-label')
      },
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      variant: "outlined"
    })));
  }
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  updateMpyJAct: _multiplicity.updateMpyJ
}, dispatch);
MpyCoupling.propTypes = {
  classes: _propTypes.default.object.isRequired,
  row: _propTypes.default.object.isRequired,
  updateMpyJAct: _propTypes.default.func.isRequired
};
var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(MpyCoupling));
exports.default = _default;