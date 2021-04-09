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

var _GpsFixedOutlined = require('@material-ui/icons/GpsFixedOutlined');

var _GpsFixedOutlined2 = _interopRequireDefault(_GpsFixedOutlined);

var _HelpOutlineOutlined = require('@material-ui/icons/HelpOutlineOutlined');

var _HelpOutlineOutlined2 = _interopRequireDefault(_HelpOutlineOutlined);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _styles = require('@material-ui/core/styles');

var _common = require('./common');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

var _carbonFeatures = require('../../helpers/carbonFeatures');

var _extractPeaksEdit = require('../../helpers/extractPeaksEdit');

var _ui = require('../../actions/ui');

var _list_ui = require('../../constants/list_ui');

var _chem = require('../../helpers/chem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var styles = function styles() {
  return Object.assign({}, _common.commonStyle, {
    tTxt: {
      fontSize: '0.8rem',
      fontFamily: 'Helvetica',
      marginRight: 5
    },
    btnWidthUnknown: {
      minWidth: 30,
      width: 30
    },
    btnWidthIr: {
      minWidth: 30,
      width: 30
    },
    btnWidthNmr: {
      minWidth: 80,
      width: 80
    }
  });
};

var MuPredictButton = (0, _styles.withStyles)({
  root: {
    border: '1px solid #ccc',
    borderRadius: 4,
    fontFamily: 'Helvetica',
    fontSize: 20,
    height: 30,
    lineHeight: '20px',
    padding: 0
  }
})(_Button2.default);

var onClickFail = function onClickFail(layoutSt, simuCount, realCount) {
  var feature = _format2.default.is13CLayout(layoutSt) ? 'peak' : 'multiplet';

  return function () {
    return alert('Selected ' + feature + ' count (' + realCount + ') must be larger than 0, and must be eqal or less than simulated count (' + simuCount + ').');
  }; // eslint-disable-line
};

var onClickReady = function onClickReady(forecast, peaksEdit, layoutSt, scan, shiftSt, thres, analysis, integrationSt, multiplicitySt, setUiViewerTypeAct) {
  var btnCb = forecast.btnCb;

  if (!btnCb) {
    return function () {
      return alert('[Developer Warning] You need to implement btnCb in forecast!');
    }; // eslint-disable-line
  }

  return function () {
    setUiViewerTypeAct(_list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS);

    return btnCb({
      peaks: peaksEdit,
      layout: layoutSt,
      scan: scan,
      thres: thres,
      analysis: analysis,
      integration: integrationSt,
      multiplicity: multiplicitySt,
      shift: shiftSt
    });
  };
};

var onClicUnknown = function onClicUnknown(feature, forecast, peaksEdit, layoutSt, scan, shiftSt, thres, analysis, integrationSt, multiplicitySt) {
  var refreshCb = forecast.refreshCb;

  if (!refreshCb) {
    return function () {
      return alert('[Developer Warning] You need to implement refreshCb in forecast!');
    }; // eslint-disable-line
  }

  return function () {
    return refreshCb({
      peaks: peaksEdit,
      layout: layoutSt,
      scan: scan,
      shift: shiftSt,
      thres: thres,
      analysis: analysis,
      integration: integrationSt,
      multiplicity: multiplicitySt
    });
  };
};

var counterText = function counterText(classes, isIr, realCount, uniqCount, simuCount) {
  return isIr ? null : _react2.default.createElement(
    'span',
    { className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
    realCount + '/' + uniqCount + '/' + simuCount
  );
};

var renderBtnPredict = function renderBtnPredict(classes, isIr, realCount, uniqCount, simuCount, color, btnWidthCls, onClick) {
  return _react2.default.createElement(
    _Tooltip2.default,
    {
      title: _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Predict'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          '- Selected features must be eqal or less than simulated features.'
        )
      )
    },
    _react2.default.createElement(
      MuPredictButton,
      {
        className: (0, _classnames2.default)('btn-sv-bar-submit', btnWidthCls),
        style: { color: color },
        onClick: onClick
      },
      counterText(classes, isIr, realCount, uniqCount, simuCount),
      _react2.default.createElement(_GpsFixedOutlined2.default, { className: classes.icon })
    )
  );
};

var renderBtnUnknown = function renderBtnUnknown(classes, onClick) {
  return _react2.default.createElement(
    _Tooltip2.default,
    {
      title: _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          'Refresh Simulation'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          '- Simulation must be refreshed before making a prediction.'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'span',
          { className: 'txt-sv-tp' },
          '- If you continue to see this button after clicking it, the server is not ready. Please wait for a while.'
        )
      )
    },
    _react2.default.createElement(
      MuPredictButton,
      {
        className: (0, _classnames2.default)('btn-sv-bar-submit', classes.btnWidthUnknown),
        style: { color: 'orange' },
        onClick: onClick
      },
      _react2.default.createElement(_HelpOutlineOutlined2.default, { className: classes.icon })
    )
  );
};

var BtnPredict = function BtnPredict(_ref) {
  var classes = _ref.classes,
      feature = _ref.feature,
      forecast = _ref.forecast,
      layoutSt = _ref.layoutSt,
      simulationSt = _ref.simulationSt,
      editPeakSt = _ref.editPeakSt,
      scanSt = _ref.scanSt,
      shiftSt = _ref.shiftSt,
      thresSt = _ref.thresSt,
      integrationSt = _ref.integrationSt,
      multiplicitySt = _ref.multiplicitySt,
      setUiViewerTypeAct = _ref.setUiViewerTypeAct;

  var is13Cor1H = _format2.default.is13CLayout(layoutSt) || _format2.default.is1HLayout(layoutSt);
  var isIr = _format2.default.isIrLayout(layoutSt);
  if (!(is13Cor1H || isIr)) return null;

  var oriPeaksEdit = (0, _extractPeaksEdit.extractPeaksEdit)(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  var peaksEdit = _format2.default.rmShiftFromPeaks(oriPeaksEdit, shiftSt);
  var scan = (0, _chem.Convert2Scan)(feature, scanSt);
  var thres = (0, _chem.Convert2Thres)(feature, thresSt);
  var simuCount = simulationSt.nmrSimPeaks.length;
  var uniqCount = [].concat(_toConsumableArray(new Set(simulationSt.nmrSimPeaks))).length;
  var realCount = _format2.default.is13CLayout(layoutSt) ? (0, _carbonFeatures.carbonFeatures)(peaksEdit, multiplicitySt).length : multiplicitySt.stack.length;

  if (is13Cor1H && simuCount === 0) {
    var onClickUnknownCb = onClicUnknown(feature, forecast, peaksEdit, layoutSt, scan, shiftSt, thres, forecast.predictions, integrationSt, multiplicitySt);
    return renderBtnUnknown(classes, onClickUnknownCb);
  }

  var predictable = isIr || simuCount >= realCount && realCount > 0;
  var color = predictable ? 'green' : 'red';

  var onClick = predictable ? onClickReady(forecast, peaksEdit, layoutSt, scan, shiftSt, thres, forecast.predictions, integrationSt, multiplicitySt, setUiViewerTypeAct) : onClickFail(layoutSt, simuCount, realCount);

  var btnWidthCls = isIr ? classes.btnWidthIr : classes.btnWidthNmr;

  return renderBtnPredict(classes, isIr, realCount, uniqCount, simuCount, color, btnWidthCls, onClick);
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      simulationSt: state.simulation,
      editPeakSt: state.editPeak.present,
      scanSt: state.scan,
      shiftSt: state.shift,
      thresSt: state.threshold,
      integrationSt: state.integration.present,
      multiplicitySt: state.multiplicity.present
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    setUiViewerTypeAct: _ui.setUiViewerType
  }, dispatch);
};

BtnPredict.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  feature: _propTypes2.default.object.isRequired,
  forecast: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  simulationSt: _propTypes2.default.array.isRequired,
  editPeakSt: _propTypes2.default.object.isRequired,
  scanSt: _propTypes2.default.object.isRequired,
  shiftSt: _propTypes2.default.object.isRequired,
  thresSt: _propTypes2.default.object.isRequired,
  integrationSt: _propTypes2.default.object.isRequired,
  multiplicitySt: _propTypes2.default.object.isRequired,
  setUiViewerTypeAct: _propTypes2.default.func.isRequired
};

exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), (0, _styles.withStyles)(styles))(BtnPredict);