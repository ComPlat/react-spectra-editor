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

var _ExpansionPanel = require('@material-ui/core/ExpansionPanel');

var _ExpansionPanel2 = _interopRequireDefault(_ExpansionPanel);

var _ExpansionPanelSummary = require('@material-ui/core/ExpansionPanelSummary');

var _ExpansionPanelSummary2 = _interopRequireDefault(_ExpansionPanelSummary);

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

var _TableRow = require('@material-ui/core/TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _HighlightOff = require('@material-ui/icons/HighlightOff');

var _HighlightOff2 = _interopRequireDefault(_HighlightOff);

var _styles = require('@material-ui/core/styles');

var _Checkbox = require('@material-ui/core/Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _Button = require('@material-ui/core/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Tooltip = require('@material-ui/core/Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _RefreshOutlined = require('@material-ui/icons/RefreshOutlined');

var _RefreshOutlined2 = _interopRequireDefault(_RefreshOutlined);

var _multiplicity = require('../../actions/multiplicity');

var _multiplicity_select = require('./multiplicity_select');

var _multiplicity_select2 = _interopRequireDefault(_multiplicity_select);

var _multiplicity_coupling = require('./multiplicity_coupling');

var _multiplicity_coupling2 = _interopRequireDefault(_multiplicity_coupling);

var _multiplicity_calc = require('../../helpers/multiplicity_calc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles(theme) {
  return {
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
      backgroundColor: '#2196f3',
      height: 32
    },
    tRowHeadNeg: {
      backgroundColor: '#fa004f',
      height: 32
    },
    tTxtHead: {
      color: 'white',
      padding: '4px 0 4px 5px'
    },
    tTxtHeadXY: {
      color: 'white',
      padding: '4px 0 4px 90px'
    },
    tTxt: {
      padding: 0
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
    },
    moCard: {
      textAlign: 'left'
    },
    moCardHead: {
      backgroundColor: '#999',
      color: 'white'
    },
    moExtId: {
      border: '2px solid white',
      borderRadius: 12,
      color: 'white',
      margin: '0 5px 0 5px',
      padding: '0 5px 0 5px'
    },
    moExtTxt: {
      margin: '0 5px 0 5x',
      fontSize: '0.8rem',
      fontFamily: 'Helvetica'
    },
    moSelect: {
      margin: '0 5x 0 5px',
      fontSize: '0.8rem',
      fontFamily: 'Helvetica'
    },
    moCBox: {
      marginLeft: 24,
      padding: '4px 0 4px 4px'
    },
    btnRf: {
      color: '#fff',
      float: 'right',
      minWidth: 40,
      right: 15
    }
  };
};

var cBoxStyle = function cBoxStyle() {
  return {
    root: {
      color: 'white',
      '&$checked': {
        color: 'white'
      }
    },
    checked: {}
  };
};
var MUCheckbox = (0, _styles.withStyles)(cBoxStyle)(_Checkbox2.default);

var createData = function createData(idx, xExtent, peaks, shift, smExtext, mpyType, js, onClick, onRefresh) {
  return {
    idx: idx + 1,
    xExtent: xExtent,
    onClick: onClick,
    onRefresh: onRefresh,
    peaks: peaks,
    center: (0, _multiplicity_calc.calcMpyCenter)(peaks, shift, mpyType),
    jStr: (0, _multiplicity_calc.calcMpyJStr)(js),
    mpyType: mpyType,
    isCheck: smExtext.xL === xExtent.xL && smExtext.xU === xExtent.xU
  };
};

var pkList = function pkList(classes, row, shift, digits, rmMpyPeakByPanelAct) {
  return row.peaks.map(function (pk) {
    var xExtent = row.xExtent;

    var cb = function cb() {
      return rmMpyPeakByPanelAct({ peak: pk, xExtent: xExtent });
    };
    var rmBtn = _react2.default.createElement(_HighlightOff2.default, { onClick: cb, className: classes.rmBtn });

    return _react2.default.createElement(
      _TableRow2.default,
      { key: pk.x, className: classes.tRow, hover: true },
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
        '(' + (pk.x - shift).toFixed(digits) + ', ' + pk.y.toExponential(2) + ')'
      ),
      _react2.default.createElement(
        _TableCell2.default,
        { align: 'right', className: (0, _classnames2.default)(classes.tTxt, 'txt-sv-panel-txt') },
        rmBtn
      )
    );
  });
};

var refreshBtn = function refreshBtn(classes, onRefresh) {
  return _react2.default.createElement(
    _Tooltip2.default,
    {
      placement: 'left',
      title: _react2.default.createElement(
        'span',
        { className: 'txt-sv-tp' },
        'Calculate Multiplicity'
      )
    },
    _react2.default.createElement(
      _Button2.default,
      {
        className: classes.btnRf,
        onClick: onRefresh
      },
      _react2.default.createElement(_RefreshOutlined2.default, null)
    )
  );
};

var mpyList = function mpyList(classes, digits, multiplicitySt, curveSt, clickMpyOneAct, rmMpyPeakByPanelAct, resetMpyOneAct) {
  var curveIdx = curveSt.curveIdx;
  var multiplicities = multiplicitySt.multiplicities;

  var selectedMulti = multiplicities[curveIdx];
  if (selectedMulti === undefined) {
    selectedMulti = {
      stack: [],
      shift: 0,
      smExtext: false,
      edited: false
    };
  }

  var _selectedMulti = selectedMulti,
      stack = _selectedMulti.stack,
      shift = _selectedMulti.shift,
      smExtext = _selectedMulti.smExtext;

  var rows = stack.map(function (k, idx) {
    var peaks = k.peaks,
        xExtent = k.xExtent,
        mpyType = k.mpyType,
        js = k.js;

    var onRefresh = function onRefresh() {
      return resetMpyOneAct(xExtent);
    };
    var onClick = function onClick(e) {
      e.stopPropagation();
      e.preventDefault();
      clickMpyOneAct(xExtent);
    };
    return createData(idx, xExtent, peaks, shift, smExtext, mpyType, js, onClick, onRefresh);
  });

  return _react2.default.createElement(
    'div',
    null,
    rows.map(function (row) {
      return _react2.default.createElement(
        'div',
        { className: classes.moCard, key: row.idx },
        _react2.default.createElement(
          'div',
          { className: classes.moCardHead },
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(MUCheckbox, {
              className: classes.moCBox,
              checked: row.isCheck,
              onChange: row.onClick
            }),
            _react2.default.createElement(
              'span',
              { className: (0, _classnames2.default)(classes.moExtTxt, classes.moExtId, 'txt-sv-panel-head') },
              row.idx
            ),
            _react2.default.createElement(
              'span',
              { className: (0, _classnames2.default)(classes.moExtTxt, 'txt-sv-panel-head') },
              row.center.toFixed(3) + ' (ppm)'
            ),
            _react2.default.createElement(
              'span',
              { className: (0, _classnames2.default)(classes.moSelect, 'txt-sv-panel-head') },
              _react2.default.createElement(_multiplicity_select2.default, { target: row })
            ),
            refreshBtn(classes, row.onRefresh)
          ),
          _react2.default.createElement(_multiplicity_coupling2.default, {
            row: row
          })
        ),
        _react2.default.createElement(
          _Table2.default,
          { className: classes.table },
          _react2.default.createElement(
            _TableBody2.default,
            null,
            pkList(classes, row, shift, digits, rmMpyPeakByPanelAct)
          )
        )
      );
    })
  );
};

var MultiplicityPanel = function MultiplicityPanel(_ref) {
  var classes = _ref.classes,
      expand = _ref.expand,
      onExapnd = _ref.onExapnd,
      multiplicitySt = _ref.multiplicitySt,
      curveSt = _ref.curveSt,
      clickMpyOneAct = _ref.clickMpyOneAct,
      rmMpyPeakByPanelAct = _ref.rmMpyPeakByPanelAct,
      resetMpyOneAct = _ref.resetMpyOneAct;

  var digits = 4;

  return _react2.default.createElement(
    _ExpansionPanel2.default,
    {
      expanded: expand,
      onChange: onExapnd,
      className: (0, _classnames2.default)(classes.panel),
      TransitionProps: { unmountOnExit: true } // increase ExpansionPanel performance
    },
    _react2.default.createElement(
      _ExpansionPanelSummary2.default,
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
          'Multiplicity'
        )
      )
    ),
    _react2.default.createElement(_Divider2.default, null),
    _react2.default.createElement(
      'div',
      { className: (0, _classnames2.default)(classes.panelDetail) },
      mpyList(classes, digits, multiplicitySt, curveSt, clickMpyOneAct, rmMpyPeakByPanelAct, resetMpyOneAct)
    )
  );
};

var mapStateToProps = function mapStateToProps(state, props) {
  return (// eslint-disable-line
    {
      integrationSt: state.integration.present,
      multiplicitySt: state.multiplicity.present,
      curveSt: state.curve
    }
  );
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return (0, _redux.bindActionCreators)({
    clickMpyOneAct: _multiplicity.clickMpyOne,
    rmMpyPeakByPanelAct: _multiplicity.rmMpyPeakByPanel,
    resetMpyOneAct: _multiplicity.resetMpyOne
  }, dispatch);
};

MultiplicityPanel.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  expand: _propTypes2.default.bool.isRequired,
  onExapnd: _propTypes2.default.func.isRequired,
  multiplicitySt: _propTypes2.default.object.isRequired,
  clickMpyOneAct: _propTypes2.default.func.isRequired,
  rmMpyPeakByPanelAct: _propTypes2.default.func.isRequired,
  resetMpyOneAct: _propTypes2.default.func.isRequired,
  curveSt: _propTypes2.default.object.isRequired
};

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(MultiplicityPanel));