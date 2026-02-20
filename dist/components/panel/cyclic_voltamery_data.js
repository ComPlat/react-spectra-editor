"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _ExpandLess = _interopRequireDefault(require("@mui/icons-material/ExpandLess"));
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _AddCircleOutline = _interopRequireDefault(require("@mui/icons-material/AddCircleOutline"));
var _RemoveCircle = _interopRequireDefault(require("@mui/icons-material/RemoveCircle"));
var _Info = _interopRequireDefault(require("@mui/icons-material/Info"));
var _Help = _interopRequireDefault(require("@mui/icons-material/Help"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
var _ui = require("../../actions/ui");
var _list_ui = require("../../constants/list_ui");
var _chem = require("../../helpers/chem");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/* eslint-disable function-paren-newline, react/require-default-props,
react/no-unused-prop-types, react/jsx-closing-tag-location, max-len, react/jsx-one-expression-per-line,
react/jsx-indent, react/no-unescaped-entities, react/jsx-wrap-multilines, camelcase, no-shadow,
arrow-body-style, react/function-component-definition */

const MAX_VISIBLE_ROWS = 6;
const ROW_HEIGHT_PX = 28;
const HEADER_HEIGHT_PX = 24;
const EXPANDED_HEIGHT = HEADER_HEIGHT_PX + MAX_VISIBLE_ROWS * ROW_HEIGHT_PX;
const styles = () => ({
  panel: {
    backgroundColor: '#f7f7f7',
    border: '1px solid #e6e6e6',
    borderRadius: 8,
    overflow: 'hidden'
  },
  panelHeader: {
    backgroundColor: '#eee',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center'
  },
  panelActions: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  howToWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4
  },
  toggleBtn: {
    padding: 0
  },
  table: {
    width: '100%',
    overflowWrap: 'anywhere',
    fontSize: '11px !important'
  },
  tableWrap: {
    padding: '3px 6px 5px',
    height: 'auto',
    maxHeight: EXPANDED_HEIGHT,
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'max-height 200ms ease'
  },
  tableWrapCollapsed: {
    maxHeight: 0,
    padding: '0 5px',
    overflow: 'hidden'
  },
  tableHeadRow: {
    backgroundColor: '#f5f5f5'
  },
  tableHeadCell: {
    fontWeight: 600,
    color: '#333',
    fontSize: '11px !important'
  },
  tableBodyRow: {
    '&:nth-of-type(even)': {
      backgroundColor: '#fafafa'
    }
  },
  td: {
    wordWrap: 'break-all',
    fontSize: '14px !important'
  },
  cellSelected: {
    backgroundColor: '#2196f3',
    color: '#fff',
    fontSize: '13px !important'
  },
  btnRemove: {
    color: 'red'
  },
  btnAddRow: {
    color: 'green'
  },
  tTxt: {
    padding: '5px 2px',
    lineHeight: 1.2,
    verticalAlign: 'top',
    fontSize: '11px !important'
  },
  infoIcon: {
    width: '15px',
    height: '16px'
  },
  txtToolTip: {
    lineHeight: 'normal !important',
    fontSize: '14px !important'
  },
  rowRoot: {
    border: '1px solid #e6e6e6',
    borderRadius: 6,
    minHeight: 40,
    lineHeight: 1.4,
    padding: '10px 16px',
    textAlign: 'left'
  },
  rowOdd: {
    backgroundColor: '#fff',
    textOverflow: 'clip',
    whiteSpace: 'normal'
  },
  rowEven: {
    backgroundColor: '#fafafa',
    textOverflow: 'clip',
    whiteSpace: 'normal'
  }
});
const CyclicVoltammetryPanel = ({
  classes,
  cyclicVotaSt,
  feature,
  addNewPairPeakAct,
  setWorkWithMaxPeakAct,
  selectPairPeakAct,
  removePairPeakAct,
  selectRefPeaksAct,
  sweepTypeSt,
  setUiSweepTypeAct,
  jcampIdx,
  userManualLink
}) => {
  const [isExpanded, setIsExpanded] = (0, _react.useState)(false);
  const {
    spectraList
  } = cyclicVotaSt;
  const spectra = spectraList[jcampIdx];
  let list = [];
  if (spectra !== undefined) {
    list = spectra.list;
  }
  const selectCell = (idx, isMax) => {
    setWorkWithMaxPeakAct({
      isMax,
      jcampIdx
    });
    selectPairPeakAct({
      index: idx,
      jcampIdx
    });
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
  const changeCheckRefPeaks = (idx, event) => {
    selectRefPeaksAct({
      index: idx,
      jcampIdx,
      checked: event.target.checked
    });
  };
  const getDelta = data => {
    return data.max && data.min ? _format.default.strNumberFixedLength((0, _chem.GetCyclicVoltaPeakSeparate)(data.max.x, data.min.x) * 1000, 3) : 'nd';
  };
  const getRatio = (feature, data) => {
    const featureData = feature.data[0];
    const idx = featureData.x.indexOf(feature.maxX);
    const y_pecker = data.pecker ? data.pecker.y : featureData.y[idx];
    return data.max && data.min ? _format.default.strNumberFixedLength((0, _chem.GetCyclicVoltaRatio)(data.max.y, data.min.y, y_pecker), 3) : 'nd';
  };
  const rows = list.map((o, idx) => ({
    idx,
    max: o.max ? `E: ${_format.default.strNumberFixedLength(parseFloat(o.max.x), 3)} V,\nI: ${parseFloat(o.max.y * 1000).toExponential(2)} mA` : 'nd',
    min: o.min ? `E: ${_format.default.strNumberFixedLength(parseFloat(o.min.x), 3)} V,\nI: ${parseFloat(o.min.y * 1000).toExponential(2)} mA` : 'nd',
    pecker: o.pecker ? `${parseFloat(o.pecker.y * 1000).toExponential(2)} mA` : 'nd',
    delta: `${getDelta(o)} mV`,
    ratio: getRatio(feature, o),
    e12: typeof o.e12 === 'number' ? `${_format.default.strNumberFixedLength(o.e12, 3)} V` : 'nd',
    isRef: o.isRef,
    onClickMax: () => selectCell(idx, true),
    onClickMin: () => selectCell(idx, false),
    remove: () => removePairPeakAct({
      index: idx,
      jcampIdx
    }),
    onCheckRefChanged: e => changeCheckRefPeaks(idx, e)
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: classes.panel,
    "data-testid": "PanelVoltammetry",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: classes.panelHeader,
      role: "button",
      tabIndex: 0,
      onClick: () => setIsExpanded(prev => !prev),
      onKeyDown: event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsExpanded(prev => !prev);
        }
      },
      "aria-expanded": isExpanded,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Typography, {
        className: "txt-panel-header",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title'),
          children: "Voltammetry data"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: classes.panelActions,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
          title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: (0, _classnames.default)(classes.txtToolTip),
            children: "Click here to open the User manual document"
          }),
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
            className: classes.howToWrap,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("a", {
              target: "_blank",
              rel: "noopener noreferrer",
              href: userManualLink,
              children: "How-To"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Help.default, {
              className: (0, _classnames.default)(classes.infoIcon)
            })]
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.IconButton, {
          size: "small",
          className: classes.toggleBtn,
          onClick: event => {
            event.stopPropagation();
            setIsExpanded(prev => !prev);
          },
          "aria-label": isExpanded ? 'Collapse table' : 'Expand table',
          children: isExpanded ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandLess.default, {}) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandMore.default, {})
        })]
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Divider, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: (0, _classnames.default)(classes.tableWrap, !isExpanded && classes.tableWrapCollapsed),
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Table, {
        className: classes.table,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableHead, {
          children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
            className: classes.tableHeadRow,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: "Ref"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: "Anodic"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: "Cathodic"
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: ["I ", /*#__PURE__*/(0, _jsxRuntime.jsx)("sub", {
                children: "\u03BB0"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
                title: /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
                  className: (0, _classnames.default)(classes.txtToolTip),
                  children: ["Baseline correction value for I ratio ", /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), "(a.k.a y value of pecker)"]
                }),
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
                  className: (0, _classnames.default)(classes.infoIcon)
                })
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: ["I ratio", /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
                title: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: (0, _classnames.default)(classes.txtToolTip),
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                    children: "Nicholson's method"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("i", {
                    children: "NICHOLSON, Rl S. Semiempirical Procedure for Measuring with Stationary Electrode Polarography Rates of Chemical Reactions Involving the Product of Electron Transfer. Analytical Chemistry, 1966, 38. Jg., Nr. 10, S. 1406-1406. https://doi.org/10.1021/ac60242a030"
                  })]
                }),
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
                  className: (0, _classnames.default)(classes.infoIcon)
                })
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: ["E", /*#__PURE__*/(0, _jsxRuntime.jsx)("sub", {
                children: "1/2"
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: ["\u0394E", /*#__PURE__*/(0, _jsxRuntime.jsx)("sub", {
                children: "p"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
                title: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: (0, _classnames.default)(classes.txtToolTip),
                  children: "| Epa - Epc |"
                }),
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Info.default, {
                  className: (0, _classnames.default)(classes.infoIcon)
                })
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.tableHeadCell, classes.square, 'txt-sv-panel-txt'),
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_AddCircleOutline.default, {
                onClick: () => addNewPairPeakAct(jcampIdx),
                className: (0, _classnames.default)(classes.btnAddRow)
              })
            })]
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableBody, {
          children: rows.map(row => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
            className: classes.tableBodyRow,
            hover: true,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Checkbox, {
                size: "small",
                checked: row.isRef,
                onChange: row.onCheckRefChanged,
                sx: {
                  padding: 0
                }
              })
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
              onClick: row.onClickMax,
              children: row.max.split('\n').map((s, index) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.default.Fragment, {
                children: [s, /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {})]
              }, index))
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, !spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
              onClick: row.onClickMin,
              children: row.min.split('\n').map((s, index) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_react.default.Fragment, {
                children: [s, /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {})]
              }, index))
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
              children: row.pecker
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
              children: row.ratio
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
              children: row.e12
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
              children: row.delta
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
              align: "left",
              className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RemoveCircle.default, {
                className: (0, _classnames.default)(classes.btnRemove),
                onClick: row.remove
              })
            })]
          }, row.idx))
        })]
      })
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  cyclicVotaSt: state.cyclicvolta,
  sweepTypeSt: state.ui.sweepType
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  addNewPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
  setWorkWithMaxPeakAct: _cyclic_voltammetry.setWorkWithMaxPeak,
  selectPairPeakAct: _cyclic_voltammetry.selectPairPeak,
  removePairPeakAct: _cyclic_voltammetry.removeCylicVoltaPairPeak,
  selectRefPeaksAct: _cyclic_voltammetry.selectRefPeaks,
  setUiSweepTypeAct: _ui.setUiSweepType
}, dispatch);
CyclicVoltammetryPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  feature: _propTypes.default.object.isRequired,
  cyclicVotaSt: _propTypes.default.object.isRequired,
  addNewPairPeakAct: _propTypes.default.func.isRequired,
  setWorkWithMaxPeakAct: _propTypes.default.func.isRequired,
  selectPairPeakAct: _propTypes.default.func.isRequired,
  removePairPeakAct: _propTypes.default.func.isRequired,
  selectRefPeaksAct: _propTypes.default.func.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  sweepTypeSt: _propTypes.default.string.isRequired,
  userManualLink: _propTypes.default.string,
  jcampIdx: _propTypes.default.number
};
CyclicVoltammetryPanel.defaultProps = {
  jcampIdx: 0
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(CyclicVoltammetryPanel));