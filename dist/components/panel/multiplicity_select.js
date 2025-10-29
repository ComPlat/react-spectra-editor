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
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _multiplicity = require("../../actions/multiplicity");
/* eslint-disable react/function-component-definition */

const Styles = () => ({
  formControl: {
    minWidth: 50,
    margin: '2px 3px 0 3px'
  },
  txtField: {
    width: 120,
    margin: '3px 3px 3px 3px'
  },
  txtInput: {
    height: 24,
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
    color: 'white'
  }
});
const MpySelect = ({
  classes,
  target,
  selectMpyTypeAct
}) => {
  const {
    mpyType,
    xExtent
  } = target;
  const onBlur = e => selectMpyTypeAct({
    xExtent,
    mpyType: e.target.value
  });
  const onChange = e => selectMpyTypeAct({
    xExtent,
    mpyType: e.target.value
  });
  const onEnterPress = e => {
    if (e.key === 'Enter') {
      selectMpyTypeAct({
        xExtent,
        mpyType: e.target.value
      });
    }
  };
  return /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    className: (0, _classnames.default)(classes.formControl),
    variant: "outlined"
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    className: (0, _classnames.default)(classes.txtField, 'txt-cmd-field'),
    value: mpyType,
    margin: "none",
    variant: "outlined",
    InputProps: {
      className: (0, _classnames.default)(classes.txtInput, 'txt-sv-input-label')
    },
    onChange: onChange,
    onBlur: onBlur,
    onKeyPress: onEnterPress
  }));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  selectMpyTypeAct: _multiplicity.selectMpyType
}, dispatch);
MpySelect.propTypes = {
  classes: _propTypes.default.object.isRequired,
  target: _propTypes.default.object.isRequired,
  selectMpyTypeAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(Styles)(MpySelect));