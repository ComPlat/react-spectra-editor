'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _styles = require('@material-ui/core/styles');

var _index = require('./components/panel/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./components/cmd_bar/index');

var _index4 = _interopRequireDefault(_index3);

var _layer_content = require('./layer_content');

var _layer_content2 = _interopRequireDefault(_layer_content);

var _list_ui = require('./constants/list_ui');

var _extractParams2 = require('./helpers/extractParams');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return {};
};

var LayerPrism = function LayerPrism(_ref) {
  var entity = _ref.entity,
      cLabel = _ref.cLabel,
      xLabel = _ref.xLabel,
      yLabel = _ref.yLabel,
      xUnit = _ref.xUnit,
      yUnit = _ref.yUnit,
      forecast = _ref.forecast,
      operations = _ref.operations,
      descriptions = _ref.descriptions,
      molSvg = _ref.molSvg,
      editorOnly = _ref.editorOnly,
      thresSt = _ref.thresSt,
      scanSt = _ref.scanSt,
      uiSt = _ref.uiSt,
      canChangeDescription = _ref.canChangeDescription,
      onDescriptionChanged = _ref.onDescriptionChanged;

  var _extractParams = (0, _extractParams2.extractParams)(entity, thresSt, scanSt),
      topic = _extractParams.topic,
      feature = _extractParams.feature,
      hasEdit = _extractParams.hasEdit,
      integration = _extractParams.integration;

  if (!topic) return null;

  var viewer = uiSt.viewer;

  if (viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS) {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_index4.default, {
        feature: feature,
        hasEdit: hasEdit,
        forecast: forecast,
        operations: operations,
        editorOnly: editorOnly
      }),
      _react2.default.createElement(
        'div',
        { className: 'react-spectrum-editor' },
        _react2.default.createElement(
          _Grid2.default,
          { container: true },
          _react2.default.createElement(
            _Grid2.default,
            { item: true, xs: 12 },
            _react2.default.createElement(_layer_content2.default, {
              topic: topic,
              feature: feature,
              cLabel: cLabel,
              xLabel: xLabel,
              yLabel: yLabel,
              forecast: forecast,
              operations: operations
            })
          )
        )
      )
    );
  }

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_index4.default, {
      feature: feature,
      hasEdit: hasEdit,
      forecast: forecast,
      operations: operations,
      editorOnly: editorOnly
    }),
    _react2.default.createElement(
      'div',
      { className: 'react-spectrum-editor' },
      _react2.default.createElement(
        _Grid2.default,
        { container: true },
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 9 },
          _react2.default.createElement(_layer_content2.default, {
            topic: topic,
            feature: feature,
            cLabel: cLabel,
            xLabel: xLabel,
            yLabel: yLabel,
            forecast: forecast,
            operations: operations
          })
        ),
        _react2.default.createElement(
          _Grid2.default,
          { item: true, xs: 3, align: 'center' },
          _react2.default.createElement(_index2.default, {
            feature: feature,
            integration: integration,
            editorOnly: editorOnly,
            molSvg: molSvg,
            descriptions: descriptions,
            canChangeDescription: canChangeDescription,
            onDescriptionChanged: onDescriptionChanged,
            xUnit: xUnit,
            yUnit: yUnit
          })
        )
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      scanSt: state.scan,
      thresSt: state.threshold,
      uiSt: state.ui
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

LayerPrism.propTypes = {
  entity: _propTypes2.default.object.isRequired,
  cLabel: _propTypes2.default.string.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  yLabel: _propTypes2.default.string.isRequired,
  xUnit: _propTypes2.default.string.isRequired,
  yUnit: _propTypes2.default.string.isRequired,
  molSvg: _propTypes2.default.string.isRequired,
  editorOnly: _propTypes2.default.bool.isRequired,
  forecast: _propTypes2.default.object.isRequired,
  operations: _propTypes2.default.array.isRequired,
  descriptions: _propTypes2.default.array.isRequired,
  thresSt: _propTypes2.default.object.isRequired,
  scanSt: _propTypes2.default.object.isRequired,
  uiSt: _propTypes2.default.object.isRequired,
  canChangeDescription: _propTypes2.default.bool.isRequired,
  onDescriptionChanged: _propTypes2.default.func
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerPrism));