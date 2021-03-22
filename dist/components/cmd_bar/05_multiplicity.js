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

var _ui = require('../../actions/ui');

var _multiplicity = require('../../actions/multiplicity');

var _list_ui = require('../../constants/list_ui');

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _tri_btn = require('./tri_btn');

var _tri_btn2 = _interopRequireDefault(_tri_btn);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle);
};

var Multiplicity = function Multiplicity(_ref) {
  var classes = _ref.classes,
      isFocusAddMpySt = _ref.isFocusAddMpySt,
      disableAddMpySt = _ref.disableAddMpySt,
      isFocusRmMpySt = _ref.isFocusRmMpySt,
      disableRmMpySt = _ref.disableRmMpySt,
      isFocusAddPeakSt = _ref.isFocusAddPeakSt,
      isFocusRmPeakSt = _ref.isFocusRmPeakSt,
      disableMpyPeakSt = _ref.disableMpyPeakSt,
      setUiSweepTypeAct = _ref.setUiSweepTypeAct,
      clearMpyAllAct = _ref.clearMpyAllAct;

  var onSweepMutAdd = function onSweepMutAdd() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD);
  };
  var onOneMutAdd = function onOneMutAdd() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM);
  };
  var onPeakMutAdd = function onPeakMutAdd() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD);
  };
  var onPeakMutRm = function onPeakMutRm() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM);
  };

  return _react2.default.createElement(
    'span',
    { className: classes.group },
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Add Multiplicity'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusAddMpySt, classes), 'btn-sv-bar-addmpy'),
            disabled: disableAddMpySt,
            onClick: onSweepMutAdd
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-addmpy') },
            'J+'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Remove Multiplicity'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusRmMpySt, classes), 'btn-sv-bar-rmmpy'),
            disabled: disableRmMpySt,
            onClick: onOneMutAdd
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-rmmpy') },
            'J-'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Add Peak for Multiplicity'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusAddPeakSt, classes), 'btn-sv-bar-addpeakmpy'),
            disabled: disableMpyPeakSt,
            onClick: onPeakMutAdd
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-addpeakmpy') },
            'JP+'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Remove Peak for Multiplicity'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusRmPeakSt, classes), 'btn-sv-bar-rmpeakmpy'),
            disabled: disableMpyPeakSt,
            onClick: onPeakMutRm
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-rmpeakmpy') },
            'JP-'
          )
        )
      )
    ),
    _react2.default.createElement(
      _tri_btn2.default,
      {
        content: { tp: 'Clear All Multiplicity' },
        cb: clearMpyAllAct
      },
      _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-rmallmpy') },
        'Jx'
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      isFocusAddMpySt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD,
      disableAddMpySt: _cfg2.default.btnCmdMpy(state.layout),
      isFocusRmMpySt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM,
      disableRmMpySt: _cfg2.default.btnCmdMpy(state.layout),
      isFocusAddPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD,
      isFocusRmPeakSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM,
      disableMpyPeakSt: _cfg2.default.btnCmdMpyPeak(state.layout, state.multiplicity.present)
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setUiSweepTypeAct: _ui.setUiSweepType,
    clearMpyAllAct: _multiplicity.clearMpyAll
  }, dispatch);
};

Multiplicity.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  isFocusAddMpySt: _propTypes2.default.bool.isRequired,
  disableAddMpySt: _propTypes2.default.bool.isRequired,
  isFocusRmMpySt: _propTypes2.default.bool.isRequired,
  disableRmMpySt: _propTypes2.default.bool.isRequired,
  isFocusAddPeakSt: _propTypes2.default.bool.isRequired,
  isFocusRmPeakSt: _propTypes2.default.bool.isRequired,
  disableMpyPeakSt: _propTypes2.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes2.default.func.isRequired,
  clearMpyAllAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(Multiplicity));