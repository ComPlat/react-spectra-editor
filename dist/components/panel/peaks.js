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

var _core = require('@material-ui/core');

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _Divider = require('@material-ui/core/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _Table = require('@material-ui/core/Table');

var _Table2 = _interopRequireDefault(_Table);

var _TableBody = require('@material-ui/core/TableBody');

var _TableBody2 = _interopRequireDefault(_TableBody);

var _TableCell = require('@material-ui/core/TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _TableHead = require('@material-ui/core/TableHead');

var _TableHead2 = _interopRequireDefault(_TableHead);

var _TableRow = require('@material-ui/core/TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _HighlightOff = require('@material-ui/icons/HighlightOff');

var _HighlightOff2 = _interopRequireDefault(_HighlightOff);

var _styles = require('@material-ui/core/styles');

var _chem = require('../../helpers/chem');

var _edit_peak = require('../../actions/edit_peak');

var _format = require('../../helpers/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles(theme) {
  return {
    chip: {
      margin: '1px 0 1px 0'
    },
    panel: {
      backgroundColor: '#eee',
      display: 'table-row'
    },
    panelSummary: {
      backgroundColor: '#eee',
      height: 32
    },
    txtBadge: {},
    panelDetail: {
      backgroundColor: '#fff',
      maxHeight: 'calc(90vh - 220px)', // ROI
      overflow: 'auto'
    },
    table: {
      width: '100%'
    },
    tRowHeadPos: {
      backgroundColor: '#999',
      height: 32
    },
    tRowHeadNeg: {
      backgroundColor: '#999',
      height: 32
    },
    tTxtHead: {
      color: 'white',
      padding: '5px 5px 5px 5px'
    },
    tTxtHeadXY: {
      color: 'white',
      padding: '4px 0 4px 90px'
    },
    tTxt: {
      padding: '4px 0 4px 0'
    },
    tRow: {
      height: 28,
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.background.default
      }
    },
    rmBtn: {
      color: 'red',
      '&:hover': {
        borderRadius: 12,
        backgroundColor: 'red',
        color: 'white'
      }
    }
  };
};

var createData = function createData(classes, idx, x, y, cb, digits) {
  return {
    idx: idx + 1,
    x: x.toFixed(digits),
    y: y,
    rmBtn: _react2.default.createElement(_HighlightOff2.default, { onClick: cb, className: classes.rmBtn })
  };
};

var peakList = function peakList(peaks, digits, cbAct, classes, isPos) {
  var rows = peaks.map(function (pp, idx) {
    var onDelete = function onDelete() {
      return cbAct(pp);
    };
    return createData(classes, idx, pp.x, pp.y, onDelete, digits);
  });

  var rowKlass = isPos ? classes.tRowHeadPos : classes.tRowHeadNeg;
  var headTxt = isPos ? 'P+' : 'P-';

  return _react2.default.createElement(
    _Table2.default,
    { className: classes.table },
    _react2.default.createElement(
      _TableHead2.default,
      null,
      _react2.default.createElement(
        _TableRow2.default,
        { className: rowKlass },
        _react2.default.createElement(
          _TableCell2.default,
          { align: 'right', className: (0, _classnames2.default)(classes.tTxtHead, 'txt-sv-panel-head') },
          _react2.default.createElement(
            'i',
            null,
            headTxt
          )
        ),
        _react2.default.createElement(
          _TableCell2.default,
          { align: 'right', className: (0, _classnames2.default)(classes.tTxtHeadXY, 'txt-sv-panel-head') },
          'X'
        ),
        _react2.default.createElement(
          _TableCell2.default,
          { align: 'right', className: (0, _classnames2.default)(classes.tTxtHeadXY, 'txt-sv-panel-head') },
          'Y'
        ),
        _react2.default.createElement(
          _TableCell2.default,
          { align: 'right', className: (0, _classnames2.default)(classes.tTxtHead, 'txt-sv-panel-head') },
          '-'
        )
      )
    ),
    _react2.default.createElement(
      _TableBody2.default,
      null,
      rows.map(function (row) {
        return _react2.default.createElement(
          _TableRow2.default,
          { key: row.idx, className: classes.tRow, hover: true },
          _react2.default.createElement(
            _TableCell2.default,
            { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
            row.idx
          ),
          _react2.default.createElement(
            _TableCell2.default,
            { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
            row.x
          ),
          _react2.default.createElement(
            _TableCell2.default,
            { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
            row.y.toExponential(2)
          ),
          _react2.default.createElement(
            _TableCell2.default,
            { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
            row.rmBtn
          )
        );
      })
    )
  );
};

var PeakPanel = function PeakPanel(_ref) {
  var editPeakSt = _ref.editPeakSt,
      layoutSt = _ref.layoutSt,
      classes = _ref.classes,
      expand = _ref.expand,
      onExapnd = _ref.onExapnd,
      rmFromPosListAct = _ref.rmFromPosListAct,
      rmFromNegListAct = _ref.rmFromNegListAct,
      curveSt = _ref.curveSt;
  var curveIdx = curveSt.curveIdx,
      listCurves = curveSt.listCurves;
  var peaks = editPeakSt.peaks;

  if (curveIdx >= peaks.length) {
    return null;
  }
  var selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    return null;
  }
  var pos = selectedEditPeaks.pos;


  var selectedCurve = listCurves[curveIdx];
  if (!selectedCurve) {
    return null;
  }
  var feature = selectedCurve.feature;

  var currentPeakOfCurve = (0, _chem.Convert2Peak)(feature);

  var peaksData = [].concat(currentPeakOfCurve).concat(pos);

  var digits = _format2.default.isEmWaveLayout(layoutSt) ? 0 : 4;

  return _react2.default.createElement(
    _core.Accordion,
    { 'data-testid': 'PeaksPanelInfo',
      expanded: expand,
      onChange: onExapnd,
      className: (0, _classnames2.default)(classes.panel),
      TransitionProps: { unmountOnExit: true } // increase ExpansionPanel performance
    },
    _react2.default.createElement(
      _core.AccordionSummary,
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
          'Peaks'
        )
      )
    ),
    _react2.default.createElement(_Divider2.default, null),
    _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)(classes.panelDetail) },
      peakList(peaksData, digits, rmFromPosListAct, classes, true)
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      editPeakSt: state.editPeak.present,
      layoutSt: state.layout,
      curveSt: state.curve
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    rmFromPosListAct: _edit_peak.rmFromPosList,
    rmFromNegListAct: _edit_peak.rmFromNegList
  }, dispatch);
};

PeakPanel.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  expand: _propTypes2.default.bool.isRequired,
  editPeakSt: _propTypes2.default.object.isRequired,
  layoutSt: _propTypes2.default.string.isRequired,
  onExapnd: _propTypes2.default.func.isRequired,
  rmFromPosListAct: _propTypes2.default.func.isRequired,
  rmFromNegListAct: _propTypes2.default.func.isRequired,
  curveSt: _propTypes2.default.object.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(PeakPanel));