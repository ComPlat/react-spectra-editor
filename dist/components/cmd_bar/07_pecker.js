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

var _common = require('./common');

var _list_ui = require('../../constants/list_ui');

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle);
};

var Pecker = function Pecker(_ref) {
  var classes = _ref.classes,
      layoutSt = _ref.layoutSt,
      isFocusAddPeckerSt = _ref.isFocusAddPeckerSt,
      isFocusRmPeckerSt = _ref.isFocusRmPeckerSt,
      setUiSweepTypeAct = _ref.setUiSweepTypeAct,
      jcampIdx = _ref.jcampIdx;

  var onSweepPeckerAdd = function onSweepPeckerAdd() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER, jcampIdx);
  };
  var onSweepPeckerDELETE = function onSweepPeckerDELETE() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER, jcampIdx);
  };

  return !_cfg2.default.hidePanelCyclicVolta(layoutSt) ? _react2.default.createElement(
    'span',
    null,
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Add Pecker'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusAddPeckerSt, classes), 'btn-sv-bar-addpeak'),
            onClick: onSweepPeckerAdd
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-addpeak') },
            'Pe+'
          )
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Remove Pecker'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)((0, _common.focusStyle)(isFocusRmPeckerSt, classes), 'btn-sv-bar-rmpeak'),
            onClick: onSweepPeckerDELETE
          },
          _react2.default.createElement(
            'span',
            { className: (0, _classnames2.default)(classes.txt, 'txt-sv-bar-rmpeak') },
            'Pe-'
          )
        )
      )
    )
  ) : _react2.default.createElement('span', null);
};

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      isFocusAddPeckerSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER,
      isFocusRmPeckerSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER,
      cyclicVotaSt: state.cyclicvolta
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setUiSweepTypeAct: _ui.setUiSweepType
  }, dispatch);
};

Pecker.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  isFocusAddPeckerSt: _propTypes2.default.bool.isRequired,
  isFocusRmPeckerSt: _propTypes2.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes2.default.func.isRequired,
  cyclicVotaSt: _propTypes2.default.object.isRequired,
  jcampIdx: _propTypes2.default.any
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Pecker);