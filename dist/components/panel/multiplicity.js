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
var _RefreshOutlined = _interopRequireDefault(require("@mui/icons-material/RefreshOutlined"));
var _multiplicity = require("../../actions/multiplicity");
var _multiplicity_select = _interopRequireDefault(require("./multiplicity_select"));
var _multiplicity_coupling = _interopRequireDefault(require("./multiplicity_coupling"));
var _multiplicity_calc = require("../../helpers/multiplicity_calc");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable function-paren-newline,
function-call-argument-newline, react/function-component-definition */

const styles = theme => ({
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
});
const cBoxStyle = () => ({
  root: {
    color: 'white',
    '&$checked': {
      color: 'white'
    }
  },
  checked: {}
});
const MUCheckbox = (0, _styles.withStyles)(cBoxStyle)(_material.Checkbox);
const createData = (idx, xExtent, peaks, shift, smExtext, mpyType, js, onClick, onRefresh) => ({
  idx: idx + 1,
  xExtent,
  onClick,
  onRefresh,
  peaks,
  center: (0, _multiplicity_calc.calcMpyCenter)(peaks, shift, mpyType),
  jStr: (0, _multiplicity_calc.calcMpyJStr)(js),
  mpyType,
  isCheck: smExtext.xL === xExtent.xL && smExtext.xU === xExtent.xU
});
const pkList = (classes, row, shift, digits, rmMpyPeakByPanelAct) => row.peaks.map(pk => {
  const {
    xExtent
  } = row;
  const cb = () => rmMpyPeakByPanelAct({
    peak: pk,
    xExtent
  });
  const rmBtn = /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
    onClick: cb,
    className: classes.rmBtn
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
    className: classes.tRow,
    hover: true,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
      children: `(${(pk.x - shift).toFixed(digits)}, ${pk.y.toExponential(2)})`
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt'),
      children: rmBtn
    })]
  }, pk.x);
});
const refreshBtn = (classes, onRefresh) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
  placement: "left",
  title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: "txt-sv-tp",
    children: "Calculate Multiplicity"
  }),
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Button, {
    className: classes.btnRf,
    onClick: onRefresh,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RefreshOutlined.default, {})
  })
});
const mpyList = (classes, digits, multiplicitySt, curveSt, clickMpyOneAct, rmMpyPeakByPanelAct, resetMpyOneAct) => {
  const {
    curveIdx
  } = curveSt;
  const {
    multiplicities
  } = multiplicitySt;
  let selectedMulti = multiplicities[curveIdx];
  if (selectedMulti === undefined) {
    selectedMulti = {
      stack: [],
      shift: 0,
      smExtext: false,
      edited: false
    };
  }
  const {
    stack,
    shift,
    smExtext
  } = selectedMulti;
  const rows = stack.map((k, idx) => {
    const {
      peaks,
      xExtent,
      mpyType,
      js
    } = k;
    const onRefresh = () => resetMpyOneAct(xExtent);
    const onClick = e => {
      e.stopPropagation();
      e.preventDefault();
      const payload = {
        curveIdx,
        payloadData: xExtent
      };
      clickMpyOneAct(payload);
    };
    return createData(idx, xExtent, peaks, shift, smExtext, mpyType, js, onClick, onRefresh);
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    children: rows.map(row => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.moCard,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.moCardHead,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(MUCheckbox, {
            className: classes.moCBox,
            checked: row.isCheck,
            onChange: row.onClick
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.moExtTxt, classes.moExtId, 'txt-sv-panel-head'),
            children: row.idx
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.moExtTxt, 'txt-sv-panel-head'),
            children: `${row.center.toFixed(3)} (ppm)`
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.moSelect, 'txt-sv-panel-head'),
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_multiplicity_select.default, {
              target: row
            })
          }), refreshBtn(classes, row.onRefresh)]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_multiplicity_coupling.default, {
          row: row
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Table, {
        className: classes.table,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableBody, {
          children: pkList(classes, row, shift, digits, rmMpyPeakByPanelAct)
        })
      })]
    }, row.idx))
  });
};
const MultiplicityPanel = ({
  classes,
  expand,
  onExapnd,
  multiplicitySt,
  curveSt,
  clickMpyOneAct,
  rmMpyPeakByPanelAct,
  resetMpyOneAct
}) => {
  const digits = 4;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Accordion, {
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
          children: "Multiplicity"
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Divider, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: (0, _classnames.default)(classes.panelDetail),
      children: mpyList(classes, digits, multiplicitySt, curveSt, clickMpyOneAct, rmMpyPeakByPanelAct, resetMpyOneAct)
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  integrationSt: state.integration.present,
  multiplicitySt: state.multiplicity.present,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  clickMpyOneAct: _multiplicity.clickMpyOne,
  rmMpyPeakByPanelAct: _multiplicity.rmMpyPeakByPanel,
  resetMpyOneAct: _multiplicity.resetMpyOne
}, dispatch);
MultiplicityPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  multiplicitySt: _propTypes.default.object.isRequired,
  clickMpyOneAct: _propTypes.default.func.isRequired,
  rmMpyPeakByPanelAct: _propTypes.default.func.isRequired,
  resetMpyOneAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(MultiplicityPanel));