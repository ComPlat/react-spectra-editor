'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = require('@material-ui/core/styles');

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _TextField = require('@material-ui/core/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _react3 = require('@mdi/react');

var _react4 = _interopRequireDefault(_react3);

var _js = require('@mdi/js');

var _integration = require('../../actions/integration');

var _ui = require('../../actions/ui');

var _list_ui = require('../../constants/list_ui');

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _tri_btn = require('./tri_btn');

var _tri_btn2 = _interopRequireDefault(_tri_btn);

var _common = require('./common');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({
    field: {
      width: 80
    },
    txtIcon: {}
  }, _common.commonStyle);
};

var iconSize = '16px';

var setFactor = function setFactor(classes, isDisable, refFactor, setIntegrationFkrAct) {
  var onBlur = function onBlur(e) {
    return setIntegrationFkrAct(e.target.value);
  };
  var onChange = function onChange(e) {
    return setIntegrationFkrAct(e.target.value);
  };
  var onEnterPress = function onEnterPress(e) {
    if (e.key === 'Enter') {
      setIntegrationFkrAct(e.target.value);
    }
  };

  return _react2.default.createElement(_TextField2.default, {
    className: classes.field,
    disabled: isDisable,
    id: 'intg-factor-name',
    type: 'number',
    value: refFactor || 1.00,
    margin: 'none',
    InputProps: {
      className: (0, _classnames2.default)(classes.txtInput, 'txtfield-sv-bar-input')
    },
    label: _react2.default.createElement(
      'span',
      { className: (0, _classnames2.default)(classes.txtLabel, 'txtfield-sv-bar-label') },
      'Ref Area'
    ),
    onChange: onChange,
    onBlur: onBlur,
    onKeyPress: onEnterPress,
    variant: 'outlined'
  });
};

var iconColor = function iconColor(criteria) {
  return criteria ? '#fff' : '#000';
};

var Integration = function Integration(_ref) {
  var classes = _ref.classes,
      refFactorSt = _ref.refFactorSt,
      ignoreRef = _ref.ignoreRef,
      isDisableSt = _ref.isDisableSt,
      isFocusAddIntgSt = _ref.isFocusAddIntgSt,
      isFocusRmIntgSt = _ref.isFocusRmIntgSt,
      isFocusSetRefSt = _ref.isFocusSetRefSt,
      setUiSweepTypeAct = _ref.setUiSweepTypeAct,
      setIntegrationFkrAct = _ref.setIntegrationFkrAct,
      clearIntegrationAllAct = _ref.clearIntegrationAllAct;

  var onSweepIntegtAdd = function onSweepIntegtAdd() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD);
  };
  var onSweepIntegtRm = function onSweepIntegtRm() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM);
  };
  var onSweepIntegtSR = function onSweepIntegtSR() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF);
  };

  return _react2.default.createElement(
    'span',
    { className: classes.group },
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Add Integration'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusAddIntgSt, classes)),
            disabled: isDisableSt,
            onClick: onSweepIntegtAdd
          },
          _react2.default.createElement(_react4.default, {
            path: _js.mdiMathIntegral,
            size: iconSize,
            color: iconColor(isFocusAddIntgSt || isDisableSt),
            className: (0, _classnames2.default)(classes.iconMdi, 'icon-sv-bar-addint')
          }),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-addint') },
            '+'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Remove Integration'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusRmIntgSt, classes)),
            disabled: isDisableSt,
            onClick: onSweepIntegtRm
          },
          _react2.default.createElement(_react4.default, {
            path: _js.mdiMathIntegral,
            size: iconSize,
            color: iconColor(isFocusRmIntgSt || isDisableSt),
            className: (0, _classnames2.default)(classes.iconMdi, 'icon-sv-bar-rmint')
          }),
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-rmint') },
            '-'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Set Integration Reference'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusSetRefSt, classes)),
            disabled: isDisableSt,
            onClick: onSweepIntegtSR
          },
          _react2.default.createElement(_react4.default, {
            path: _js.mdiReflectVertical,
            size: iconSize,
            color: iconColor(isFocusSetRefSt || isDisableSt),
            className: (0, _classnames2.default)(classes.iconMdi, 'icon-sv-bar-refint')
          })
        )
      )
    ),
    !ignoreRef ? setFactor(classes, isDisableSt, refFactorSt, setIntegrationFkrAct) : null,
    _react2.default.createElement(
      _tri_btn2.default,
      {
        content: { tp: 'Clear All Integration' },
        cb: clearIntegrationAllAct
      },
      _react2.default.createElement(_react4.default, {
        path: _js.mdiMathIntegral,
        size: iconSize,
        color: iconColor(isDisableSt),
        className: (0, _classnames2.default)(classes.iconMdi, 'icon-sv-bar-rmallint')
      }),
      _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)(classes.txt, classes.txtIcon, 'txt-sv-bar-rmallint') },
        'x'
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      isDisableSt: _cfg2.default.btnCmdIntg(state.layout),
      isFocusAddIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
      isFocusRmIntgSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
      isFocusSetRefSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF,
      refFactorSt: state.integration.present.refFactor,
      ignoreRef: _format2.default.isHplcUvVisLayout(state.layout)
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setUiSweepTypeAct: _ui.setUiSweepType,
    setIntegrationFkrAct: _integration.setIntegrationFkr,
    clearIntegrationAllAct: _integration.clearIntegrationAll
  }, dispatch);
};

Integration.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  isDisableSt: _propTypes2.default.bool.isRequired,
  isFocusAddIntgSt: _propTypes2.default.bool.isRequired,
  isFocusRmIntgSt: _propTypes2.default.bool.isRequired,
  isFocusSetRefSt: _propTypes2.default.bool.isRequired,
  refFactorSt: _propTypes2.default.number.isRequired,
  ignoreRef: _propTypes2.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes2.default.func.isRequired,
  setIntegrationFkrAct: _propTypes2.default.func.isRequired,
  clearIntegrationAllAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Integration));