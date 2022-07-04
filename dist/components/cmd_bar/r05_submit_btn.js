'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _redux = require('redux');

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _PlayCircleOutline = require('@material-ui/icons/PlayCircleOutline');

var _PlayCircleOutline2 = _interopRequireDefault(_PlayCircleOutline);

var _styles = require('@material-ui/core/styles');

var _chem = require('../../helpers/chem');

var _common = require('./common');

var _extractPeaksEdit = require('../../helpers/extractPeaksEdit');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle);
};

var onClickCb = function onClickCb(operation, peaksEdit, isAscend, isIntensity, scan, thres, layoutSt, shiftSt, analysis, decimalSt, integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt, cyclicvoltaSt, curveSt) {
  return function () {
    operation({
      peaks: peaksEdit,
      layout: layoutSt,
      shift: shiftSt,
      scan: scan,
      thres: thres,
      isAscend: isAscend,
      isIntensity: isIntensity,
      analysis: analysis,
      decimal: decimalSt,
      integration: integrationSt,
      multiplicity: multiplicitySt,
      allIntegration: allIntegrationSt,
      aucValues: aucValues,
      waveLength: waveLengthSt,
      cyclicvoltaSt: cyclicvoltaSt,
      curveSt: curveSt
    });
  };
};

var BtnSubmit = function BtnSubmit(_ref) {
  var classes = _ref.classes,
      operation = _ref.operation,
      feature = _ref.feature,
      isAscend = _ref.isAscend,
      isIntensity = _ref.isIntensity,
      editPeakSt = _ref.editPeakSt,
      thresSt = _ref.thresSt,
      layoutSt = _ref.layoutSt,
      shiftSt = _ref.shiftSt,
      scanSt = _ref.scanSt,
      forecastSt = _ref.forecastSt,
      decimalSt = _ref.decimalSt,
      integrationSt = _ref.integrationSt,
      multiplicitySt = _ref.multiplicitySt,
      allIntegrationSt = _ref.allIntegrationSt,
      waveLengthSt = _ref.waveLengthSt,
      cyclicvoltaSt = _ref.cyclicvoltaSt,
      curveSt = _ref.curveSt;

  var peaksEdit = (0, _extractPeaksEdit.extractPeaksEdit)(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  // const disBtn = peaksEdit.length === 0 || statusSt.btnSubmit || disabled;
  var scan = (0, _chem.Convert2Scan)(feature, scanSt);
  var thres = (0, _chem.Convert2Thres)(feature, thresSt);
  var aucValues = (0, _extractPeaksEdit.extractAreaUnderCurve)(allIntegrationSt, integrationSt, layoutSt);

  if (!operation) return null;

  return _react2.default.createElement(
    _Tooltip2.default,
    { title: _react2.default.createElement(
        'span',
        { className: 'txt-sv-tp' },
        'Submit'
      ) },
    _react2.default.createElement(
      _common.MuButton,
      {
        className: (0, _classnames2.default)('btn-sv-bar-submit'),
        color: 'primary',
        onClick: onClickCb(operation.value, peaksEdit, isAscend, isIntensity, scan, thres, layoutSt, shiftSt, forecastSt.predictions, decimalSt, integrationSt, multiplicitySt, allIntegrationSt, aucValues, waveLengthSt, cyclicvoltaSt, curveSt)
      },
      _react2.default.createElement(_PlayCircleOutline2.default, { className: classes.icon })
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      editPeakSt: state.editPeak.present,
      thresSt: state.threshold,
      layoutSt: state.layout,
      shiftSt: state.shift,
      scanSt: state.scan,
      forecastSt: state.forecast,
      decimalSt: state.submit.decimal,
      integrationSt: state.integration.present,
      multiplicitySt: state.multiplicity.present,
      allIntegrationSt: state.integration.past.concat(state.integration.present),
      waveLengthSt: state.wavelength,
      cyclicvoltaSt: state.cyclicvolta,
      curveSt: state.curve
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({}, dispatch);
};

BtnSubmit.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  isAscend: _propTypes2.default.bool.isRequired,
  isIntensity: _propTypes2.default.bool.isRequired,
  operation: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.bool]).isRequired,
  editPeakSt: _propTypes2.default.object.isRequired,
  thresSt: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  shiftSt: _propTypes2.default.object.isRequired,
  scanSt: _propTypes2.default.object.isRequired,
  forecastSt: _propTypes2.default.object.isRequired,
  decimalSt: _propTypes2.default.number.isRequired,
  integrationSt: _propTypes2.default.object.isRequired,
  multiplicitySt: _propTypes2.default.object.isRequired,
  allIntegrationSt: _propTypes2.default.object.isRequired,
  waveLengthSt: _propTypes2.default.object.isRequired,
  cyclicvoltaSt: _propTypes2.default.object.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(BtnSubmit);