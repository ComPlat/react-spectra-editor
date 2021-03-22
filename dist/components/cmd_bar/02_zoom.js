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

var _ZoomInOutlined = require('@material-ui/icons/ZoomInOutlined');

var _ZoomInOutlined2 = _interopRequireDefault(_ZoomInOutlined);

var _FindReplaceOutlined = require('@material-ui/icons/FindReplaceOutlined');

var _FindReplaceOutlined2 = _interopRequireDefault(_FindReplaceOutlined);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _ui = require('../../actions/ui');

var _common = require('./common');

var _list_ui = require('../../constants/list_ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle);
};

var Zoom = function Zoom(_ref) {
  var classes = _ref.classes,
      isfocusZoomSt = _ref.isfocusZoomSt,
      setUiSweepTypeAct = _ref.setUiSweepTypeAct;

  var onSweepZoomIn = function onSweepZoomIn() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN);
  };
  var onSweepZoomReset = function onSweepZoomReset() {
    return setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET);
  };

  return _react2.default.createElement(
    'span',
    { className: classes.group },
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Zoom In'
        ) },
      _react2.default.createElement(
        _common.MuButton,
        {
          className: (0, _classnames2.default)((0, _common.focusStyle)(isfocusZoomSt, classes), 'btn-sv-bar-zoomin'),
          onClick: onSweepZoomIn
        },
        _react2.default.createElement(_ZoomInOutlined2.default, { className: (0, _classnames2.default)(classes.icon, classes.iconWp) })
      )
    ),
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Reset Zoom'
        ) },
      _react2.default.createElement(
        _common.MuButton,
        {
          className: (0, _classnames2.default)('btn-sv-bar-zoomreset'),
          onClick: onSweepZoomReset
        },
        _react2.default.createElement(_FindReplaceOutlined2.default, { className: classes.icon })
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {
      isfocusZoomSt: state.ui.sweepType === _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setUiSweepTypeAct: _ui.setUiSweepType
  }, dispatch);
};

Zoom.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  isfocusZoomSt: _propTypes2.default.bool.isRequired,
  setUiSweepTypeAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Zoom);