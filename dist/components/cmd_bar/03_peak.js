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

var _AddLocationOutlined = require('@material-ui/icons/AddLocationOutlined');

var _AddLocationOutlined2 = _interopRequireDefault(_AddLocationOutlined);

var _ui = require('../../actions/ui');

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _common = require('./common');

var _list_ui = require('../../constants/list_ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle);
};

var Peak = function Peak(_ref) {
  var classes = _ref.classes,
      setUiSweepTypeAct = _ref.setUiSweepTypeAct,
      isFocusAddPeakSt = _ref.isFocusAddPeakSt,
      disableAddPeakSt = _ref.disableAddPeakSt,
      isFocusRmPeakSt = _ref.isFocusRmPeakSt,
      disableRmPeakSt = _ref.disableRmPeakSt,
      isFocusSetRefSt = _ref.isFocusSetRefSt,
      disableSetRefSt = _ref.disableSetRefSt;

  var onSweepPeakAdd = function onSweepPeakAdd() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD);
  };
  var onSweepPeakDELETE = function onSweepPeakDELETE() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE);
  };
  var onSweepAnchorShift = function onSweepAnchorShift() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT);
  };

  return _react2.default.createElement(
    'span',
    { className: classes.group },
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Add Peak'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusAddPeakSt, classes), 'btn-sv-bar-addpeak'),
            disabled: disableAddPeakSt,
            onClick: onSweepPeakAdd
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-addpeak') },
            'P+'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Remove Peak'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusRmPeakSt, classes), 'btn-sv-bar-rmpeak'),
            disabled: disableRmPeakSt,
            onClick: onSweepPeakDELETE
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-rmpeak') },
            'P-'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Set Reference'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusSetRefSt, classes), 'btn-sv-bar-setref'),
            disabled: disableSetRefSt,
            onClick: onSweepAnchorShift
          },
          _react2.default.createElement(_AddLocationOutlined2.default, { className: classes.icon })
        )
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      isFocusAddPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD,
      disableAddPeakSt: _cfg2.default.btnCmdAddPeak(state.layout),
      isFocusRmPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE,
      disableRmPeakSt: _cfg2.default.btnCmdRmPeak(state.layout),
      isFocusSetRefSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT,
      disableSetRefSt: _cfg2.default.btnCmdSetRef(state.layout)
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setUiSweepTypeAct: _ui.setUiSweepType
  }, dispatch);
};

Peak.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  isFocusAddPeakSt: _propTypes2.default.bool.isRequired,
  disableAddPeakSt: _propTypes2.default.bool.isRequired,
  isFocusRmPeakSt: _propTypes2.default.bool.isRequired,
  disableRmPeakSt: _propTypes2.default.bool.isRequired,
  isFocusSetRefSt: _propTypes2.default.bool.isRequired,
  disableSetRefSt: _propTypes2.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Peak);