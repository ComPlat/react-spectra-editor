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

var _styles = require('@material-ui/core/styles');

var _common = require('./common');

var _viewer = require('./01_viewer');

var _viewer2 = _interopRequireDefault(_viewer);

var _zoom = require('./02_zoom');

var _zoom2 = _interopRequireDefault(_zoom);

var _peak = require('./03_peak');

var _peak2 = _interopRequireDefault(_peak);

var _integration = require('./04_integration');

var _integration2 = _interopRequireDefault(_integration);

var _multiplicity = require('./05_multiplicity');

var _multiplicity2 = _interopRequireDefault(_multiplicity);

var _undo_redo = require('./06_undo_redo');

var _undo_redo2 = _interopRequireDefault(_undo_redo);

var _r01_layout = require('./r01_layout');

var _r01_layout2 = _interopRequireDefault(_r01_layout);

var _r03_threshold = require('./r03_threshold');

var _r03_threshold2 = _interopRequireDefault(_r03_threshold);

var _r04_submit = require('./r04_submit');

var _r04_submit2 = _interopRequireDefault(_r04_submit);

var _r07_wavelength_btn = require('./r07_wavelength_btn');

var _r07_wavelength_btn2 = _interopRequireDefault(_r07_wavelength_btn);

var _pecker = require('./07_pecker');

var _pecker2 = _interopRequireDefault(_pecker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, {}, _common.commonStyle);
};

var CmdBar = function CmdBar(_ref) {
  var classes = _ref.classes,
      feature = _ref.feature,
      hasEdit = _ref.hasEdit,
      forecast = _ref.forecast,
      operations = _ref.operations,
      editorOnly = _ref.editorOnly,
      jcampIdx = _ref.jcampIdx,
      hideThreshold = _ref.hideThreshold;
  return _react2.default.createElement(
    'div',
    { className: classes.card },
    _react2.default.createElement(_viewer2.default, { editorOnly: editorOnly }),
    _react2.default.createElement(_zoom2.default, null),
    _react2.default.createElement(_peak2.default, { jcampIdx: jcampIdx }),
    _react2.default.createElement(_pecker2.default, { jcampIdx: jcampIdx }),
    _react2.default.createElement(_integration2.default, null),
    _react2.default.createElement(_multiplicity2.default, null),
    _react2.default.createElement(_undo_redo2.default, null),
    _react2.default.createElement(_r04_submit2.default, {
      operations: operations,
      feature: feature,
      forecast: forecast,
      editorOnly: editorOnly,
      hideSwitch: false,
      disabled: false
    }),
    hideThreshold ? null : _react2.default.createElement(_r03_threshold2.default, { feature: feature, hasEdit: hasEdit }),
    _react2.default.createElement(_r01_layout2.default, { feature: feature, hasEdit: hasEdit }),
    _react2.default.createElement(_r07_wavelength_btn2.default, null)
  );
};

var mapStateToProps = function mapStateToProps(state, _) {
  return (// eslint-disable-line
    {}
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

CmdBar.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  forecast: _propTypes2.default.object.isRequired,
  hasEdit: _propTypes2.default.bool.isRequired,
  operations: _propTypes2.default.array.isRequired,
  editorOnly: _propTypes2.default.bool.isRequired,
  jcampIdx: _propTypes2.default.any,
  hideThreshold: _propTypes2.default.bool
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(CmdBar);