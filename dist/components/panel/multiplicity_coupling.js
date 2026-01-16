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
var _material = require("@mui/material");
var _multiplicity = require("../../actions/multiplicity");
var _jsxRuntime = require("react/jsx-runtime");
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
const txtJ = () => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputAdornment, {
  position: "start",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: "txt-cmd-j",
    children: "J\xA0="
  })
});
const txtHz = () => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.InputAdornment, {
  position: "end",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: "txt-cmd-hz",
    children: "Hz"
  })
});
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: (0, _classnames.default)(classes.jDiv),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: (0, _classnames.default)(classes.moExtTxt, classes.jTxt, 'txt-sv-panel-head'),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TextField, {
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
        })
      })
    });
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
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(MpyCoupling));