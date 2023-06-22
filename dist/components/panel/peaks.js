"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _core = require("@material-ui/core");
var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Table = _interopRequireDefault(require("@material-ui/core/Table"));
var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));
var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));
var _TableHead = _interopRequireDefault(require("@material-ui/core/TableHead"));
var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));
var _HighlightOff = _interopRequireDefault(require("@material-ui/icons/HighlightOff"));
var _styles = require("@material-ui/core/styles");
var _chem = require("../../helpers/chem");
var _edit_peak = require("../../actions/edit_peak");
var _format = _interopRequireDefault(require("../../helpers/format"));
/* eslint-disable react/function-component-definition, no-unused-vars */

const styles = theme => ({
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
    maxHeight: 'calc(90vh - 220px)',
    // ROI
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
});
const createData = (classes, idx, x, y, cb, digits) => ({
  idx: idx + 1,
  x: x.toFixed(digits),
  y,
  rmBtn: /*#__PURE__*/_react.default.createElement(_HighlightOff.default, {
    onClick: cb,
    className: classes.rmBtn
  })
});
const peakList = (peaks, digits, cbAct, classes, isPos) => {
  const rows = peaks.map((pp, idx) => {
    const onDelete = () => cbAct(pp);
    return createData(classes, idx, pp.x, pp.y, onDelete, digits);
  });
  const rowKlass = isPos ? classes.tRowHeadPos : classes.tRowHeadNeg;
  const headTxt = isPos ? 'P+' : 'P-';
  return /*#__PURE__*/_react.default.createElement(_Table.default, {
    className: classes.table
  }, /*#__PURE__*/_react.default.createElement(_TableHead.default, null, /*#__PURE__*/_react.default.createElement(_TableRow.default, {
    className: rowKlass
  }, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, /*#__PURE__*/_react.default.createElement("i", null, headTxt)), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHeadXY, 'txt-sv-panel-head')
  }, "X"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHeadXY, 'txt-sv-panel-head')
  }, "Y"), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "-"))), /*#__PURE__*/_react.default.createElement(_TableBody.default, null, rows.map(row => /*#__PURE__*/_react.default.createElement(_TableRow.default, {
    key: row.idx,
    className: classes.tRow,
    hover: true
  }, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.idx), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.x), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.y.toExponential(2)), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.rmBtn)))));
};
const PeakPanel = _ref => {
  let {
    editPeakSt,
    layoutSt,
    classes,
    expand,
    onExapnd,
    rmFromPosListAct,
    rmFromNegListAct,
    curveSt
  } = _ref;
  const {
    curveIdx,
    listCurves
  } = curveSt;
  const {
    peaks
  } = editPeakSt;
  if (curveIdx >= peaks.length) {
    return null;
  }
  const selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    return null;
  }
  const {
    pos,
    neg
  } = selectedEditPeaks;
  const selectedCurve = listCurves[curveIdx];
  if (!selectedCurve) {
    return null;
  }
  const {
    feature
  } = selectedCurve;
  const currentPeakOfCurve = (0, _chem.Convert2Peak)(feature);
  const filteredArray = currentPeakOfCurve.filter(element => neg.includes(element));
  const peaksData = [].concat(filteredArray).concat(pos);
  const digits = _format.default.isEmWaveLayout(layoutSt) ? 0 : 4;
  return /*#__PURE__*/_react.default.createElement(_core.Accordion, {
    "data-testid": "PeaksPanelInfo",
    expanded: expand,
    onChange: onExapnd,
    className: (0, _classnames.default)(classes.panel),
    TransitionProps: {
      unmountOnExit: true
    } // increase ExpansionPanel performance
  }, /*#__PURE__*/_react.default.createElement(_core.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null),
    className: (0, _classnames.default)(classes.panelSummary)
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: "txt-panel-header"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title')
  }, "Peaks"))), /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.panelDetail)
  }, peakList(peaksData, digits, rmFromPosListAct, classes, true)));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  editPeakSt: state.editPeak.present,
  layoutSt: state.layout,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  rmFromPosListAct: _edit_peak.rmFromPosList,
  rmFromNegListAct: _edit_peak.rmFromNegList
}, dispatch);
PeakPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  editPeakSt: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  rmFromPosListAct: _propTypes.default.func.isRequired,
  rmFromNegListAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired
};
var _default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(PeakPanel)); // eslint-disable-line
exports.default = _default;