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
var _material = require("@mui/material");
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _HighlightOff = _interopRequireDefault(require("@mui/icons-material/HighlightOff"));
var _styles = require("@mui/styles");
var _chem = require("../../helpers/chem");
var _edit_peak = require("../../actions/edit_peak");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
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
      backgroundColor: theme.palette ? theme.palette.background.default : '#d3d3d3'
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
  rmBtn: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Table, {
    className: classes.table,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableHead, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
        className: rowKlass,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head'),
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
            children: headTxt
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxtHeadXY, 'txt-sv-panel-head'),
          children: "X"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxtHeadXY, 'txt-sv-panel-head'),
          children: "Y"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head'),
          children: "-"
        })]
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableBody, {
      children: rows.map(row => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
        className: classes.tRow,
        hover: true,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: row.idx
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: row.x
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: row.y.toExponential(2)
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
          align: "right",
          className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
          children: row.rmBtn
        })]
      }, row.idx))
    })]
  });
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Accordion, {
    "data-testid": "PeaksPanelInfo",
    expanded: expand,
    onChange: onExapnd,
    disableGutters: true,
    sx: {
      '&.MuiAccordion-root.Mui-expanded': {
        margin: 0
      },
      '&:before': {
        display: 'none'
      }
    },
    TransitionProps: {
      unmountOnExit: true
    } // increase Accordion performance
    ,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.AccordionSummary, {
      expandIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandMore.default, {}),
      className: (0, _classnames.default)(classes.panelSummary),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Typography, {
        className: "txt-panel-header",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title'),
          children: "Peaks"
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Divider, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: (0, _classnames.default)(classes.panelDetail),
      children: peakList(peaksData, digits, rmFromPosListAct, classes, true)
    })]
  });
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
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(PeakPanel)); // eslint-disable-line