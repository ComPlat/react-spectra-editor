'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _redux = require('redux');

var _core = require('@material-ui/core');

var _styles = require('@material-ui/core/styles');

var _wavelength = require('../../actions/wavelength');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

var _common = require('./common');

var _list_wavelength = require('../../constants/list_wavelength');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({
    fieldShift: {
      width: 160
    },
    fieldLayout: {
      width: 100
    }
  }, _common.commonStyle);
};

var wavelengthSelect = function wavelengthSelect(classes, waveLengthSt, layoutSt, updateWaveLengthAct) {
  if (!_format2.default.isXRDLayout(layoutSt)) {
    return _react2.default.createElement('i', null);
  }

  var onChange = function onChange(e) {
    return updateWaveLengthAct(e.target.value);
  };

  return _react2.default.createElement(
    _core.FormControl,
    {
      className: (0, _classnames2.default)(classes.fieldLayout),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _core.InputLabel,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Wavelength'
    ),
    _react2.default.createElement(
      _core.Select,
      {
        value: waveLengthSt,
        onChange: onChange,
        input: _react2.default.createElement(_core.OutlinedInput, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-layout'),
          labelWidth: 60
        })
      },
      _list_wavelength.LIST_WAVE_LENGTH.map(function (item) {
        // eslint-disable-line
        return _react2.default.createElement(
          _core.MenuItem,
          { value: item },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-layout') },
            item.label,
            ' (',
            item.value,
            ' ',
            item.unit,
            ')'
          )
        );
      })
    )
  );
};

var Wavelength = function Wavelength(_ref) {
  var classes = _ref.classes,
      waveLengthSt = _ref.waveLengthSt,
      layoutSt = _ref.layoutSt,
      updateWaveLengthAct = _ref.updateWaveLengthAct;
  return _react2.default.createElement(
    'span',
    { className: classes.groupRight },
    wavelengthSelect(classes, waveLengthSt, layoutSt, updateWaveLengthAct)
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      waveLengthSt: state.wavelength,
      layoutSt: state.layout
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    updateWaveLengthAct: _wavelength.updateWaveLength
  }, dispatch);
};

Wavelength.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  waveLengthSt: _propTypes2.default.object.isRequired,
  updateWaveLengthAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Wavelength));