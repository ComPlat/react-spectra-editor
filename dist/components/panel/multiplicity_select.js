'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _styles = require('@material-ui/core/styles');

var _multiplicity = require('../../actions/multiplicity');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Styles = function Styles() {
  return {
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
  };
};

var MpySelect = function MpySelect(_ref) {
  var classes = _ref.classes,
      target = _ref.target,
      selectMpyTypeAct = _ref.selectMpyTypeAct;
  var mpyType = target.mpyType,
      xExtent = target.xExtent;

  var onBlur = function onBlur(e) {
    return selectMpyTypeAct({ xExtent: xExtent, mpyType: e.target.value });
  };
  var onChange = function onChange(e) {
    return selectMpyTypeAct({ xExtent: xExtent, mpyType: e.target.value });
  };
  var onEnterPress = function onEnterPress(e) {
    if (e.key === 'Enter') {
      selectMpyTypeAct({ xExtent: xExtent, mpyType: e.target.value });
    }
  };

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.formControl),
      variant: 'outlined'
    },
    _react2.default.createElement(_TextField2.default, {
      className: (0, _classnames2.default)(classes.txtField, 'txt-cmd-field'),
      value: mpyType,
      margin: 'none',
      variant: 'outlined',
      InputProps: {
        className: (0, _classnames2.default)(classes.txtInput, 'txt-sv-input-label')
      },
      onChange: onChange,
      onBlur: onBlur,
      onKeyPress: onEnterPress
    })
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {}
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    selectMpyTypeAct: _multiplicity.selectMpyType
  }, dispatch);
};

MpySelect.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  target: _propTypes2.default.object.isRequired,
  selectMpyTypeAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(Styles)(MpySelect));