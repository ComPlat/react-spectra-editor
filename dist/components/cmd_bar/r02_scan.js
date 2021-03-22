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

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _CloudDoneOutlined = require('@material-ui/icons/CloudDoneOutlined');

var _CloudDoneOutlined2 = _interopRequireDefault(_CloudDoneOutlined);

var _HowToRegOutlined = require('@material-ui/icons/HowToRegOutlined');

var _HowToRegOutlined2 = _interopRequireDefault(_HowToRegOutlined);

var _RefreshOutlined = require('@material-ui/icons/RefreshOutlined');

var _RefreshOutlined2 = _interopRequireDefault(_RefreshOutlined);

var _scan = require('../../actions/scan');

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var styles = function styles() {
  return Object.assign({
    fieldScan: {
      width: 90
    }
  }, _common.commonStyle);
};

var restoreIcon = function restoreIcon(classes, hasEdit, isEdit) {
  return hasEdit && isEdit ? _react2.default.createElement(_HowToRegOutlined2.default, { className: classes.icon }) : _react2.default.createElement(_CloudDoneOutlined2.default, { className: classes.icon });
};

var restoreTp = function restoreTp(hasEdit, isEdit) {
  return hasEdit && isEdit ? 'User Defined Scan' : 'Auto Picked Scan';
};

var btnRestore = function btnRestore(classes, hasEdit, isEdit, toggleEditAct) {
  return _react2.default.createElement(
    _Tooltip2.default,
    { title: _react2.default.createElement(
        'span',
        { className: 'txt-sv-tp' },
        restoreTp(hasEdit, isEdit)
      ) },
    _react2.default.createElement(
      _common.MuButton,
      {
        className: (0, _classnames2.default)('btn-sv-bar-scanrst'),
        disabled: !hasEdit,
        onClick: toggleEditAct
      },
      restoreIcon(classes, hasEdit, isEdit)
    )
  );
};

var btnRrfresh = function btnRrfresh(classes, disabled, refreshAct) {
  return _react2.default.createElement(
    _Tooltip2.default,
    { title: _react2.default.createElement(
        'span',
        { className: 'txt-sv-tp' },
        'Refresh Scan'
      ) },
    _react2.default.createElement(
      _common.MuButton,
      {
        className: (0, _classnames2.default)('btn-sv-bar-scanrfs'),
        disabled: disabled,
        onClick: refreshAct
      },
      _react2.default.createElement(_RefreshOutlined2.default, { className: classes.icon })
    )
  );
};

var scanSelect = function scanSelect(classes, feature, layoutSt, scanSt, onChange) {
  var target = scanSt.target,
      count = scanSt.count;

  if (!count) return null;
  var range = [].concat(_toConsumableArray(Array(count + 1).keys())).slice(1);
  var content = range.map(function (num) {
    return _react2.default.createElement(
      _MenuItem2.default,
      { value: num, key: num },
      _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)(classes.txtOpt, 'option-sv-bar-scan') },
        'scan ' + num
      )
    );
  });

  var defaultValue = scanSt.isAuto || !feature.scanEditTarget ? feature.scanAutoTarget : feature.scanEditTarget;
  var selValue = target || defaultValue || 1;

  return _react2.default.createElement(
    _FormControl2.default,
    {
      className: (0, _classnames2.default)(classes.fieldScan),
      variant: 'outlined'
    },
    _react2.default.createElement(
      _InputLabel2.default,
      { className: (0, _classnames2.default)(classes.selectLabel, 'select-sv-bar-label') },
      'Current Scan'
    ),
    _react2.default.createElement(
      _Select2.default,
      {
        value: selValue,
        onChange: onChange,
        input: _react2.default.createElement(_OutlinedInput2.default, {
          className: (0, _classnames2.default)(classes.selectInput, 'input-sv-bar-scan'),
          labelWidth: 90
        })
      },
      content
    )
  );
};

var Scan = function Scan(_ref) {
  var classes = _ref.classes,
      feature = _ref.feature,
      hasEdit = _ref.hasEdit,
      layoutSt = _ref.layoutSt,
      scanSt = _ref.scanSt,
      setScanTargetAct = _ref.setScanTargetAct,
      resetScanTargetAct = _ref.resetScanTargetAct,
      toggleScanIsAutoAct = _ref.toggleScanIsAutoAct;

  var isMs = ['MS'].indexOf(layoutSt) >= 0;
  if (!isMs) return null;

  var onChange = function onChange(e) {
    return setScanTargetAct(e.target.value);
  };

  return _react2.default.createElement(
    'span',
    null,
    scanSelect(classes, feature, layoutSt, scanSt, onChange),
    btnRrfresh(classes, false, resetScanTargetAct),
    btnRestore(classes, hasEdit, !scanSt.isAuto, toggleScanIsAutoAct)
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      scanSt: state.scan
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setScanTargetAct: _scan.setScanTarget,
    resetScanTargetAct: _scan.resetScanTarget,
    toggleScanIsAutoAct: _scan.toggleScanIsAuto
  }, dispatch);
};

Scan.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  hasEdit: _propTypes2.default.bool.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  scanSt: _propTypes2.default.object.isRequired,
  setScanTargetAct: _propTypes2.default.func.isRequired,
  resetScanTargetAct: _propTypes2.default.func.isRequired,
  toggleScanIsAutoAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Scan);