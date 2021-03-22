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

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _InputAdornment = require('@material-ui/core/InputAdornment');

var _InputAdornment2 = _interopRequireDefault(_InputAdornment);

var _styles = require('@material-ui/core/styles');

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _CloudDoneOutlined = require('@material-ui/icons/CloudDoneOutlined');

var _CloudDoneOutlined2 = _interopRequireDefault(_CloudDoneOutlined);

var _HowToRegOutlined = require('@material-ui/icons/HowToRegOutlined');

var _HowToRegOutlined2 = _interopRequireDefault(_HowToRegOutlined);

var _RefreshOutlined = require('@material-ui/icons/RefreshOutlined');

var _RefreshOutlined2 = _interopRequireDefault(_RefreshOutlined);

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _threshold = require('../../actions/threshold');

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({
    field: {
      width: 110
    },
    txtIcon: {}
  }, _common.commonStyle);
};

var txtPercent = function txtPercent() {
  return _react2.default.createElement(
    _InputAdornment2.default,
    { position: 'end' },
    _react2.default.createElement(
      'span',
      { className: 'txt-percent' },
      '%'
    )
  );
};

var setThreshold = function setThreshold(classes, thresVal, updateThresholdValueAct) {
  var onBlur = function onBlur(e) {
    return updateThresholdValueAct(e.target.value);
  };
  var onChange = function onChange(e) {
    return updateThresholdValueAct(e.target.value);
  };
  var onEnterPress = function onEnterPress(e) {
    if (e.key === 'Enter') {
      updateThresholdValueAct(e.target.value);
    }
  };

  return _react2.default.createElement(_TextField2.default, {
    className: classes.field,
    id: 'outlined-name',
    placeholder: 'N.A.',
    type: 'number',
    value: thresVal || 0.01,
    margin: 'none',
    InputProps: {
      endAdornment: txtPercent(),
      className: (0, _classnames2.default)(classes.txtInput, 'txtfield-sv-bar-input'),
      inputProps: { min: 0.01 }
    },
    label: _react2.default.createElement(
      'span',
      { className: (0, _classnames2.default)(classes.txtLabel, 'txtfield-sv-bar-label') },
      'Threshold'
    ),
    onChange: onChange,
    onBlur: onBlur,
    onKeyPress: onEnterPress,
    variant: 'outlined'
  });
};

var restoreIcon = function restoreIcon(classes, hasEdit, isEdit) {
  return hasEdit && isEdit ? _react2.default.createElement(_HowToRegOutlined2.default, { className: classes.icon }) : _react2.default.createElement(_CloudDoneOutlined2.default, { className: classes.icon });
};

var restoreTp = function restoreTp(hasEdit, isEdit) {
  return hasEdit && isEdit ? 'User Defined Threshold' : 'Auto Picked Threshold';
};

var Threshold = function Threshold(_ref) {
  var classes = _ref.classes,
      feature = _ref.feature,
      hasEdit = _ref.hasEdit,
      hideThresSt = _ref.hideThresSt,
      thresValSt = _ref.thresValSt,
      isEditSt = _ref.isEditSt,
      updateThresholdValueAct = _ref.updateThresholdValueAct,
      resetThresholdValueAct = _ref.resetThresholdValueAct,
      toggleThresholdIsEditAct = _ref.toggleThresholdIsEditAct;

  var thresVal = thresValSt || feature.thresRef;

  return _react2.default.createElement(
    'span',
    { className: classes.groupRight },
    setThreshold(classes, thresVal, updateThresholdValueAct),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Restore Threshold'
        ) },
      _react2.default.createElement(
        _common.MuButton,
        {
          className: (0, _classnames2.default)('btn-sv-bar-thresref'),
          disabled: _cfg2.default.btnCmdThres(thresVal),
          onClick: resetThresholdValueAct
        },
        _react2.default.createElement(_RefreshOutlined2.default, { className: classes.icon })
      )
    ),
    hideThresSt ? null : _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          restoreTp(hasEdit, isEditSt)
        ) },
      _react2.default.createElement(
        _common.MuButton,
        {
          className: (0, _classnames2.default)('btn-sv-bar-thresrst'),
          disabled: _cfg2.default.btnCmdThres(thresVal),
          onClick: toggleThresholdIsEditAct
        },
        restoreIcon(classes, hasEdit, isEditSt)
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      hideThresSt: _cfg2.default.hideCmdThres(state.layout),
      isEditSt: state.threshold.isEdit,
      thresValSt: parseFloat(state.threshold.value) || 0
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    updateThresholdValueAct: _threshold.updateThresholdValue,
    resetThresholdValueAct: _threshold.resetThresholdValue,
    toggleThresholdIsEditAct: _threshold.toggleThresholdIsEdit
  }, dispatch);
};

Threshold.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  hasEdit: _propTypes2.default.bool.isRequired,
  hideThresSt: _propTypes2.default.bool.isRequired,
  isEditSt: _propTypes2.default.bool.isRequired,
  thresValSt: _propTypes2.default.number.isRequired,
  updateThresholdValueAct: _propTypes2.default.func.isRequired,
  resetThresholdValueAct: _propTypes2.default.func.isRequired,
  toggleThresholdIsEditAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Threshold));