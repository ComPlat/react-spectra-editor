'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reduxUndo = require('redux-undo');

var _styles = require('@material-ui/core/styles');

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _RedoOutlined = require('@material-ui/icons/RedoOutlined');

var _RedoOutlined2 = _interopRequireDefault(_RedoOutlined);

var _UndoOutlined = require('@material-ui/icons/UndoOutlined');

var _UndoOutlined2 = _interopRequireDefault(_UndoOutlined);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle);
};

var UndoRedo = function UndoRedo(_ref) {
  var classes = _ref.classes,
      canUndo = _ref.canUndo,
      canRedo = _ref.canRedo,
      onUndoAct = _ref.onUndoAct,
      onRedoAct = _ref.onRedoAct;
  return _react2.default.createElement(
    'span',
    { className: classes.group },
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Undo'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)('btn-sv-bar-undo'),
            disabled: !canUndo,
            onClick: onUndoAct
          },
          _react2.default.createElement(_UndoOutlined2.default, { className: classes.icon })
        )
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Redo'
        ) },
      _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          _common.MuButton,
          {
            className: (0, _classnames2.default)('btn-sv-bar-redo'),
            disabled: !canRedo,
            onClick: onRedoAct
          },
          _react2.default.createElement(_RedoOutlined2.default, { className: classes.icon })
        )
      )
    )
  );
};

var canUndoFunc = function canUndoFunc(state) {
  return state.editPeak.past.length > 0 || state.integration.past.length > 0 || state.multiplicity.past.length > 0;
};

var canRedoFunc = function canRedoFunc(state) {
  return state.editPeak.future.length > 0 || state.integration.future.length > 0 || state.multiplicity.future.length > 0;
};

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      canUndo: canUndoFunc(state),
      canRedo: canRedoFunc(state)
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onUndoAct: function onUndoAct() {
      return dispatch(_reduxUndo.ActionCreators.undo());
    },
    onRedoAct: function onRedoAct() {
      return dispatch(_reduxUndo.ActionCreators.redo());
    }
  };
};

UndoRedo.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  canUndo: _propTypes2.default.bool.isRequired,
  canRedo: _propTypes2.default.bool.isRequired,
  onUndoAct: _propTypes2.default.func.isRequired,
  onRedoAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(UndoRedo);