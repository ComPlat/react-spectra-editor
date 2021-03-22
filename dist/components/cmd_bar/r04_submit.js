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

var _Select = require('@material-ui/core/Select');

var _Select2 = _interopRequireDefault(_Select);

var _MenuItem = require('@material-ui/core/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _FormControl = require('@material-ui/core/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _OutlinedInput = require('@material-ui/core/OutlinedInput');

var _OutlinedInput2 = _interopRequireDefault(_OutlinedInput);

var _InputLabel = require('@material-ui/core/InputLabel');

var _InputLabel2 = _interopRequireDefault(_InputLabel);

var _styles = require('@material-ui/core/styles');

var _submit = require('../../actions/submit');

var _r05_submit_btn = require('./r05_submit_btn');

var _r05_submit_btn2 = _interopRequireDefault(_r05_submit_btn);

var _r06_predict_btn = require('./r06_predict_btn');

var _r06_predict_btn2 = _interopRequireDefault(_r06_predict_btn);

var _common = require('./common');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({
    fieldOrder: {
      width: 90
    },
    fieldIntensity: {
      width: 90
    },
    fieldDecimal: {
      width: 80
    },
    fieldOpertaion: {
      width: 120
    }
  }, _common.commonStyle);
};

var ascendSelect = function ascendSelect(classes, hideSwitch, isAscendSt, toggleIsAscendAct) {
  if (hideSwitch) return null;

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.fieldOrder),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _InputLabel2.default,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Write Peaks'
    ),
    _react2.default.createElement(
      _Select2.default,
      {
        value: isAscendSt,
        onChange: toggleIsAscendAct,
        input: _react2.default.createElement(_OutlinedInput2.default, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-order'),
          labelWidth: 90
        })
      },
      _react2.default.createElement(
        _MenuItem2.default,
        { value: true, key: 'ascend' },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-ascend') },
          'Ascend'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: false, key: 'descend' },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-descend') },
          'Descend'
        )
      )
    )
  );
};

var intensitySelect = function intensitySelect(classes, hideSwitch, isIntensitySt, toggleIsIntensityAct) {
  if (hideSwitch) return null;

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.fieldIntensity),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _InputLabel2.default,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Write Intensity'
    ),
    _react2.default.createElement(
      _Select2.default,
      {
        value: isIntensitySt,
        onChange: toggleIsIntensityAct,
        input: _react2.default.createElement(_OutlinedInput2.default, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-intensity'),
          labelWidth: 100
        })
      },
      _react2.default.createElement(
        _MenuItem2.default,
        { value: true, key: 'ascend' },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-show') },
          'Show'
        )
      ),
      _react2.default.createElement(
        _MenuItem2.default,
        { value: false, key: 'descend' },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-hide') },
          'Hide'
        )
      )
    )
  );
};

var decimalSelect = function decimalSelect(classes, hideSwitch, decimalSt, updateDecimalAct) {
  if (hideSwitch) return null;
  var decimals = [0, 1, 2, 3, 4];
  var options = decimals.map(function (d) {
    return _react2.default.createElement(
      _MenuItem2.default,
      { value: d, key: d },
      _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-decimal') },
        d
      )
    );
  });

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.fieldDecimal),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _InputLabel2.default,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Decimal'
    ),
    _react2.default.createElement(
      _Select2.default,
      {
        value: decimalSt,
        onChange: updateDecimalAct,
        input: _react2.default.createElement(_OutlinedInput2.default, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-decimal'),
          labelWidth: 60
        })
      },
      options
    )
  );
};

var operationSelect = function operationSelect(classes, operations, operation, onChangeSelect) {
  var options = operations.map(function (o) {
    return _react2.default.createElement(
      _MenuItem2.default,
      { value: o.name, key: o.name },
      _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-operation') },
        o.name
      )
    );
  });

  var selectedValue = operation.name || operations[0].name;

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.fieldOpertaion),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _InputLabel2.default,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Submit'
    ),
    _react2.default.createElement(
      _Select2.default,
      {
        value: selectedValue,
        onChange: onChangeSelect,
        input: _react2.default.createElement(_OutlinedInput2.default, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-operation'),
          labelWidth: 50
        })
      },
      options
    )
  );
};

var selectOperation = function selectOperation(name, operations, updateOperationAct) {
  var operation = false;
  operations.forEach(function (o) {
    if (o.name === name) {
      operation = o;
    }
  });
  updateOperationAct(operation);
};

var Submit = function Submit(_ref) {
  var operations = _ref.operations,
      classes = _ref.classes,
      feature = _ref.feature,
      forecast = _ref.forecast,
      editorOnly = _ref.editorOnly,
      hideSwitch = _ref.hideSwitch,
      disabled = _ref.disabled,
      isAscendSt = _ref.isAscendSt,
      isIntensitySt = _ref.isIntensitySt,
      operationSt = _ref.operationSt,
      decimalSt = _ref.decimalSt,
      isEmWaveSt = _ref.isEmWaveSt,
      toggleIsAscendAct = _ref.toggleIsAscendAct,
      toggleIsIntensityAct = _ref.toggleIsIntensityAct,
      updateOperationAct = _ref.updateOperationAct,
      updateDecimalAct = _ref.updateDecimalAct;

  var onChangeSelect = function onChangeSelect(e) {
    return selectOperation(e.target.value, operations, updateOperationAct);
  };

  if (!operations || operations.length === 0) return null;

  return _react2.default.createElement(
    'span',
    { className: classes.groupRightMost },
    ascendSelect(classes, hideSwitch, isAscendSt, toggleIsAscendAct),
    intensitySelect(classes, hideSwitch || !isEmWaveSt, isIntensitySt, toggleIsIntensityAct),
    decimalSelect(classes, hideSwitch, decimalSt, updateDecimalAct),
    editorOnly ? null : _react2.default.createElement(_r06_predict_btn2.default, {
      feature: feature,
      forecast: forecast
    }),
    operationSelect(classes, operations, operationSt, onChangeSelect),
    _react2.default.createElement(_r05_submit_btn2.default, {
      feature: feature,
      isAscend: isAscendSt,
      isIntensity: isIntensitySt,
      operation: operationSt,
      disabled: disabled
    })
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      isEmWaveSt: _format2.default.isEmWaveLayout(state.layout),
      isAscendSt: state.submit.isAscend,
      isIntensitySt: state.submit.isIntensity,
      decimalSt: state.submit.decimal,
      operationSt: state.submit.operation
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    toggleIsAscendAct: _submit.toggleIsAscend,
    toggleIsIntensityAct: _submit.toggleIsIntensity,
    updateOperationAct: _submit.updateOperation,
    updateDecimalAct: _submit.updateDecimal
  }, dispatch);
};

Submit.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  forecast: _propTypes2.default.object.isRequired,
  editorOnly: _propTypes2.default.bool.isRequired,
  operations: _propTypes2.default.array.isRequired,
  operationSt: _propTypes2.default.object.isRequired,
  hideSwitch: _propTypes2.default.bool.isRequired,
  disabled: _propTypes2.default.bool.isRequired,
  isAscendSt: _propTypes2.default.bool.isRequired,
  isIntensitySt: _propTypes2.default.bool.isRequired,
  isEmWaveSt: _propTypes2.default.bool.isRequired,
  decimalSt: _propTypes2.default.number.isRequired,
  toggleIsAscendAct: _propTypes2.default.func.isRequired,
  toggleIsIntensityAct: _propTypes2.default.func.isRequired,
  updateOperationAct: _propTypes2.default.func.isRequired,
  updateDecimalAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Submit);