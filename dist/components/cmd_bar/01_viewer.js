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

var _SpellcheckOutlined = require('@material-ui/icons/SpellcheckOutlined');

var _SpellcheckOutlined2 = _interopRequireDefault(_SpellcheckOutlined);

var _TimelineOutlined = require('@material-ui/icons/TimelineOutlined');

var _TimelineOutlined2 = _interopRequireDefault(_TimelineOutlined);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _ui = require('../../actions/ui');

var _cfg = require('../../helpers/cfg');

var _cfg2 = _interopRequireDefault(_cfg);

var _common = require('./common');

var _list_ui = require('../../constants/list_ui');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle);
};

var Viewer = function Viewer(_ref) {
  var classes = _ref.classes,
      isfocusSpectrumSt = _ref.isfocusSpectrumSt,
      isfocusAnalysisSt = _ref.isfocusAnalysisSt,
      hideCmdAnaViewerSt = _ref.hideCmdAnaViewerSt,
      disableCmdAnaViewerSt = _ref.disableCmdAnaViewerSt,
      setUiViewerTypeAct = _ref.setUiViewerTypeAct;

  var onViewSpectrum = function onViewSpectrum() {
    return setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM);
  };
  var onViewAnalysis = function onViewAnalysis() {
    return setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS);
  };

  return _react2.default.createElement(
    'span',
    { className: classes.group },
    _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Spectrum Viewer'
        ) },
      _react2.default.createElement(
        _common.MuButton,
        {
          className: (0, _classnames2.default)((0, _common.focusStyle)(isfocusSpectrumSt, classes), 'btn-sv-bar-spctrum'),
          onClick: onViewSpectrum
        },
        _react2.default.createElement(_TimelineOutlined2.default, { className: classes.icon })
      )
    ),
    hideCmdAnaViewerSt ? null : _react2.default.createElement(
      _Tooltip2.default,
      { title: _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Analysis Viewer'
        ) },
      _react2.default.createElement(
        _common.MuButton,
        {
          className: (0, _classnames2.default)((0, _common.focusStyle)(isfocusAnalysisSt, classes), 'btn-sv-bar-analysis'),
          disabled: disableCmdAnaViewerSt,
          onClick: onViewAnalysis
        },
        _react2.default.createElement(_SpellcheckOutlined2.default, { className: classes.icon })
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      isfocusSpectrumSt: state.ui.viewer === _list_ui.LIST_UI_VIEWER_TYPE.SPECTRUM,
      isfocusAnalysisSt: state.ui.viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS,
      hideCmdAnaViewerSt: _cfg2.default.hideCmdAnaViewer(state.layout) || props.editorOnly,
      disableCmdAnaViewerSt: _cfg2.default.btnCmdAnaViewer(state.layout)
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setUiViewerTypeAct: _ui.setUiViewerType
  }, dispatch);
};

Viewer.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  isfocusSpectrumSt: _propTypes2.default.bool.isRequired,
  isfocusAnalysisSt: _propTypes2.default.bool.isRequired,
  hideCmdAnaViewerSt: _propTypes2.default.bool.isRequired,
  disableCmdAnaViewerSt: _propTypes2.default.bool.isRequired,
  setUiViewerTypeAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(Viewer);