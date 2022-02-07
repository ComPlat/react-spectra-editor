'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _AddCircleOutline = require('@material-ui/icons/AddCircleOutline');

var _AddCircleOutline2 = _interopRequireDefault(_AddCircleOutline);

var _RemoveCircle = require('@material-ui/icons/RemoveCircle');

var _RemoveCircle2 = _interopRequireDefault(_RemoveCircle);

var _Info = require('@material-ui/icons/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _styles = require('@material-ui/core/styles');

var _core = require('@material-ui/core');

var _cyclic_voltammetry = require('../../actions/cyclic_voltammetry');

var _ui = require('../../actions/ui');

var _list_ui = require('../../constants/list_ui');

var _chem = require('../../helpers/chem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
  return {
    panel: {
      backgroundColor: '#eee',
      display: 'table-row'
    },
    panelSummary: {
      backgroundColor: '#eee',
      height: 32
    },
    panelDetail: {
      backgroundColor: '#fff',
      maxHeight: 'calc(90vh - 220px)', // ROI
      overflow: 'auto'
    },
    table: {
      width: '100%',
      wordWrap: 'break-all',
      fontSize: '14px !important'
    },
    td: {
      wordWrap: 'break-all',
      fontSize: '14px !important'
    },
    cellSelected: {
      backgroundColor: '#2196f3',
      color: '#fff',
      fontSize: '14px !important'
    },
    btnRemove: {
      color: 'red'
    },
    tTxt: {
      padding: 10
    },
    infoIcon: {
      width: '0.6em',
      height: '0.6em'
    },
    txtToolTip: {
      lineHeight: 'normal !important',
      fontSize: '14px !important'
    }
  };
};

var CyclicVoltammetryPanel = function CyclicVoltammetryPanel(_ref) {
  var classes = _ref.classes,
      cyclicVotaSt = _ref.cyclicVotaSt,
      feature = _ref.feature,
      addNewPairPeakAct = _ref.addNewPairPeakAct,
      setWorkWithMaxPeakAct = _ref.setWorkWithMaxPeakAct,
      selectPairPeakAct = _ref.selectPairPeakAct,
      removePairPeakAct = _ref.removePairPeakAct,
      sweepTypeSt = _ref.sweepTypeSt,
      setUiSweepTypeAct = _ref.setUiSweepTypeAct,
      jcampIdx = _ref.jcampIdx;
  var spectraList = cyclicVotaSt.spectraList;

  var spectra = spectraList[jcampIdx];
  var list = [];
  if (spectra !== undefined) {
    list = spectra.list;
  }

  var selectCell = function selectCell(idx, isMax) {
    setWorkWithMaxPeakAct({ isMax: isMax, jcampIdx: jcampIdx });
    selectPairPeakAct({ index: idx, jcampIdx: jcampIdx });
    if (sweepTypeSt === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK || sweepTypeSt === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK) {
      if (isMax) {
        setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK, jcampIdx);
      } else {
        setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK, jcampIdx);
      }
    } else if (sweepTypeSt === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK || sweepTypeSt === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK) {
      if (isMax) {
        setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK, jcampIdx);
      } else {
        setUiSweepTypeAct(_list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK, jcampIdx);
      }
    }
  };

  var getDelta = function getDelta(data) {
    return data.max && data.min ? (0, _chem.GetCyclicVoltaPeakSeparate)(data.max.x, data.min.x).toExponential(2) : "undefined";
  };

  var getRatio = function getRatio(feature, data) {
    var featureData = feature.data[0];
    var idx = featureData.x.indexOf(feature.maxX);
    var y_pecker = data.pecker ? data.pecker.y : featureData.y[idx];
    return data.max && data.min ? (0, _chem.GetCyclicVoltaRatio)(data.max.y, data.min.y, y_pecker).toExponential(2) : "undefined";
  };

  var rows = list.map(function (o, idx) {
    return {
      idx: idx,
      max: o.max ? 'x:' + parseFloat(o.max.x).toExponential(2) + ', y:' + parseFloat(o.max.y).toExponential(2) : "undefined",
      min: o.min ? 'x:' + parseFloat(o.min.x).toExponential(2) + ', y:' + parseFloat(o.min.y).toExponential(2) : "undefined",
      pecker: o.pecker ? '' + parseFloat(o.pecker.y).toExponential(2) : "undefined",
      delta: getDelta(o),
      ratio: getRatio(feature, o),
      onClickMax: function onClickMax() {
        return selectCell(idx, true);
      },
      onClickMin: function onClickMin() {
        return selectCell(idx, false);
      },
      remove: function remove() {
        return removePairPeakAct({ index: idx, jcampIdx: jcampIdx });
      }
    };
  });

  return _react2.default.createElement(
    _core.ExpansionPanel,
    null,
    _react2.default.createElement(
      _core.ExpansionPanelSummary,
      {
        expandIcon: _react2.default.createElement(_ExpandMore2.default, null),
        className: (0, _classnames2.default)(classes.panelSummary)
      },
      _react2.default.createElement(
        _Typography2.default,
        { className: 'txt-panel-header' },
        _react2.default.createElement(
          'span',
          { className: (0, _classnames2.default)(classes.txtBadge, 'txt-sv-panel-title') },
          'Voltammetry data'
        )
      )
    ),
    _react2.default.createElement(_Divider2.default, null),
    _react2.default.createElement(
      _core.Table,
      { className: classes.table },
      _react2.default.createElement(
        _core.TableHead,
        null,
        _react2.default.createElement(
          _core.TableRow,
          null,
          _react2.default.createElement(
            _core.TableCell,
            {
              align: 'left',
              className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
            },
            'Max'
          ),
          _react2.default.createElement(
            _core.TableCell,
            {
              align: 'left',
              className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
            },
            'Min'
          ),
          _react2.default.createElement(
            _core.TableCell,
            {
              align: 'left',
              className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
            },
            'I \u03BB0',
            _react2.default.createElement(
              _Tooltip2.default,
              {
                title: _react2.default.createElement(
                  'p',
                  { className: (0, _classnames2.default)(classes.txtToolTip) },
                  'Baseline correction value for I ratio ',
                  _react2.default.createElement('br', null),
                  '(aka y value of pecker)'
                )
              },
              _react2.default.createElement(_Info2.default, { className: (0, _classnames2.default)(classes.infoIcon) })
            )
          ),
          _react2.default.createElement(
            _core.TableCell,
            {
              align: 'left',
              className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
            },
            'I ratio',
            _react2.default.createElement(
              _Tooltip2.default,
              {
                title: _react2.default.createElement(
                  'div',
                  { className: (0, _classnames2.default)(classes.txtToolTip) },
                  _react2.default.createElement(
                    'p',
                    null,
                    'Nicholson\'s method'
                  ),
                  _react2.default.createElement(
                    'i',
                    null,
                    'NICHOLSON, Rl S. Semiempirical Procedure for Measuring with Stationary Electrode Polarography Rates of Chemical Reactions Involving the Product of Electron Transfer. Analytical Chemistry, 1966, 38. Jg., Nr. 10, S. 1406-1406. https://doi.org/10.1021/ac60242a030'
                  )
                )
              },
              _react2.default.createElement(_Info2.default, { className: (0, _classnames2.default)(classes.infoIcon) })
            )
          ),
          _react2.default.createElement(
            _core.TableCell,
            {
              align: 'left',
              className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
            },
            'DeltaEp',
            _react2.default.createElement(
              _Tooltip2.default,
              {
                title: _react2.default.createElement(
                  'span',
                  { className: (0, _classnames2.default)(classes.txtToolTip) },
                  '| Epa - Epc |'
                )
              },
              _react2.default.createElement(_Info2.default, { className: (0, _classnames2.default)(classes.infoIcon) })
            )
          ),
          _react2.default.createElement(
            _core.TableCell,
            {
              align: 'left',
              className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
            },
            _react2.default.createElement(_AddCircleOutline2.default, { onClick: function onClick() {
                return addNewPairPeakAct(jcampIdx);
              } })
          )
        )
      ),
      _react2.default.createElement(
        _core.TableBody,
        null,
        rows.map(function (row) {
          return _react2.default.createElement(
            _core.TableRow,
            { key: row.idx },
            _react2.default.createElement(
              _core.TableCell,
              {
                align: 'left',
                className: (0, _classnames2.default)(classes.tTxt, classes.square, spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
                onClick: row.onClickMax
              },
              row.max
            ),
            _react2.default.createElement(
              _core.TableCell,
              {
                align: 'left',
                className: (0, _classnames2.default)(classes.tTxt, classes.square, !spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
                onClick: row.onClickMin
              },
              row.min
            ),
            _react2.default.createElement(
              _core.TableCell,
              {
                align: 'left',
                className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
              },
              row.pecker
            ),
            _react2.default.createElement(
              _core.TableCell,
              {
                align: 'left',
                className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
              },
              row.ratio
            ),
            _react2.default.createElement(
              _core.TableCell,
              {
                align: 'left',
                className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
              },
              row.delta
            ),
            _react2.default.createElement(
              _core.TableCell,
              {
                align: 'left',
                className: (0, _classnames2.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
              },
              _react2.default.createElement(_RemoveCircle2.default, { className: (0, _classnames2.default)(classes.btnRemove), onClick: row.remove })
            )
          );
        })
      )
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      layoutSt: state.layout,
      cyclicVotaSt: state.cyclicvolta,
      sweepTypeSt: state.ui.sweepType
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    addNewPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
    setWorkWithMaxPeakAct: _cyclic_voltammetry.setWorkWithMaxPeak,
    selectPairPeakAct: _cyclic_voltammetry.selectPairPeak,
    removePairPeakAct: _cyclic_voltammetry.removeCylicVoltaPairPeak,
    setUiSweepTypeAct: _ui.setUiSweepType
  }, dispatch);
};

CyclicVoltammetryPanel.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  expand: _propTypes2.default.bool.isRequired,
  feature: _propTypes2.default.object.isRequired,
  molSvg: _propTypes2.default.string.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  onExapnd: _propTypes2.default.func.isRequired,
  cyclicVotaSt: _propTypes2.default.object.isRequired,
  addNewPairPeakAct: _propTypes2.default.func.isRequired,
  setWorkWithMaxPeakAct: _propTypes2.default.func.isRequired,
  selectPairPeakAct: _propTypes2.default.func.isRequired,
  removePairPeakAct: _propTypes2.default.func.isRequired,
  setUiSweepTypeAct: _propTypes2.default.func.isRequired,
  sweepTypeSt: _propTypes2.default.string.isRequired
};

CyclicVoltammetryPanel.defaultProps = {
  jcampIdx: 0
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(CyclicVoltammetryPanel));