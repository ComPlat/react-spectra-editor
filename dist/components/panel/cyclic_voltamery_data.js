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
var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));
var _AddCircleOutline = _interopRequireDefault(require("@material-ui/icons/AddCircleOutline"));
var _RemoveCircle = _interopRequireDefault(require("@material-ui/icons/RemoveCircle"));
var _Info = _interopRequireDefault(require("@material-ui/icons/Info"));
var _Help = _interopRequireDefault(require("@material-ui/icons/Help"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _core = require("@material-ui/core");
var _cyclic_voltammetry = require("../../actions/cyclic_voltammetry");
var _ui = require("../../actions/ui");
var _list_ui = require("../../constants/list_ui");
var _chem = require("../../helpers/chem");
/* eslint-disable function-paren-newline, react/require-default-props,
react/no-unused-prop-types, react/jsx-closing-tag-location, max-len, react/jsx-one-expression-per-line,
react/jsx-indent, react/no-unescaped-entities, react/jsx-wrap-multilines, camelcase, no-shadow,
arrow-body-style, react/function-component-definition */

const styles = () => ({
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
    maxHeight: 'calc(90vh - 220px)',
    // ROI
    overflow: 'auto'
  },
  table: {
    width: '100%',
    overflowWrap: 'anywhere',
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
    width: '15px',
    height: '16px'
  },
  txtToolTip: {
    lineHeight: 'normal !important',
    fontSize: '14px !important'
  },
  rowRoot: {
    border: '1px solid #eee',
    height: 36,
    lineHeight: '36px',
    overflow: 'hidden',
    paddingLeft: 24,
    textAlign: 'left'
  },
  rowOdd: {
    backgroundColor: '#fff',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  rowEven: {
    backgroundColor: '#fafafa',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
});
const CyclicVoltammetryPanel = _ref => {
  let {
    classes,
    cyclicVotaSt,
    feature,
    addNewPairPeakAct,
    setWorkWithMaxPeakAct,
    selectPairPeakAct,
    removePairPeakAct,
    sweepTypeSt,
    setUiSweepTypeAct,
    jcampIdx,
    userManualLink
  } = _ref;
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
  const getDelta = data => {
    return data.max && data.min ? (0, _chem.GetCyclicVoltaPeakSeparate)(data.max.x, data.min.x).toFixed(5) : 'undefined';
  };
  const getRatio = (feature, data) => {
    const featureData = feature.data[0];
    const idx = featureData.x.indexOf(feature.maxX);
    const y_pecker = data.pecker ? data.pecker.y : featureData.y[idx];
    return data.max && data.min ? (0, _chem.GetCyclicVoltaRatio)(data.max.y, data.min.y, y_pecker).toFixed(5) : 'undefined';
  };
  const rows = list.map((o, idx) => ({
    idx,
    max: o.max ? `x:${parseFloat(o.max.x)}, y:${parseFloat(o.max.y).toExponential(2)}` : 'undefined',
    min: o.min ? `x:${parseFloat(o.min.x)}, y:${parseFloat(o.min.y).toExponential(2)}` : 'undefined',
    pecker: o.pecker ? `${parseFloat(o.pecker.y).toExponential(2)}` : 'undefined',
    delta: getDelta(o),
    ratio: getRatio(feature, o),
    onClickMax: () => selectCell(idx, true),
    onClickMin: () => selectCell(idx, false),
    remove: () => removePairPeakAct({
      index: idx,
      jcampIdx
    })
  }));
  return /*#__PURE__*/_react.default.createElement(_core.Accordion, null, /*#__PURE__*/_react.default.createElement(_core.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null),
    className: (0, _classnames.default)(classes.panelSummary)
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: "txt-panel-header"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title')
  }, "Voltammetry data"))), /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement(_core.Table, {
    className: classes.table
  }, /*#__PURE__*/_react.default.createElement(_core.TableHead, null, /*#__PURE__*/_react.default.createElement(_core.TableRow, null, /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "Max"), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "Min"), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "I \u03BB0", /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("p", {
      className: (0, _classnames.default)(classes.txtToolTip)
    }, "Baseline correction value for I ratio ", /*#__PURE__*/_react.default.createElement("br", null), "(a.k.a y value of pecker)")
  }, /*#__PURE__*/_react.default.createElement(_Info.default, {
    className: (0, _classnames.default)(classes.infoIcon)
  }))), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "I ratio", /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)(classes.txtToolTip)
    }, /*#__PURE__*/_react.default.createElement("p", null, "Nicholson's method"), /*#__PURE__*/_react.default.createElement("i", null, "NICHOLSON, Rl S. Semiempirical Procedure for Measuring with Stationary Electrode Polarography Rates of Chemical Reactions Involving the Product of Electron Transfer. Analytical Chemistry, 1966, 38. Jg., Nr. 10, S. 1406-1406. https://doi.org/10.1021/ac60242a030"))
  }, /*#__PURE__*/_react.default.createElement(_Info.default, {
    className: (0, _classnames.default)(classes.infoIcon)
  }))), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "DeltaEp", /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtToolTip)
    }, "| Epa - Epc |")
  }, /*#__PURE__*/_react.default.createElement(_Info.default, {
    className: (0, _classnames.default)(classes.infoIcon)
  }))), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, /*#__PURE__*/_react.default.createElement(_AddCircleOutline.default, {
    onClick: () => addNewPairPeakAct(jcampIdx)
  })))), /*#__PURE__*/_react.default.createElement(_core.TableBody, null, rows.map(row => /*#__PURE__*/_react.default.createElement(_core.TableRow, {
    key: row.idx
  }, /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
    onClick: row.onClickMax
  }, row.max), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, !spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
    onClick: row.onClickMin
  }, row.min), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, row.pecker), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, row.ratio), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, row.delta), /*#__PURE__*/_react.default.createElement(_core.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, /*#__PURE__*/_react.default.createElement(_RemoveCircle.default, {
    className: (0, _classnames.default)(classes.btnRemove),
    onClick: row.remove
  })))))), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.rowRoot, classes.rowEven)
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtToolTip)
    }, "Click here to open the User manual document")
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("a", {
    target: "_blank",
    rel: "noopener noreferrer",
    href: userManualLink
  }, "How-To "), /*#__PURE__*/_react.default.createElement(_Help.default, {
    className: (0, _classnames.default)(classes.infoIcon)
  })))));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  cyclicVotaSt: state.cyclicvolta,
  sweepTypeSt: state.ui.sweepType
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  addNewPairPeakAct: _cyclic_voltammetry.addNewCylicVoltaPairPeak,
  setWorkWithMaxPeakAct: _cyclic_voltammetry.setWorkWithMaxPeak,
  selectPairPeakAct: _cyclic_voltammetry.selectPairPeak,
  removePairPeakAct: _cyclic_voltammetry.removeCylicVoltaPairPeak,
  setUiSweepTypeAct: _ui.setUiSweepType
}, dispatch);
CyclicVoltammetryPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  feature: _propTypes.default.object.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  cyclicVotaSt: _propTypes.default.object.isRequired,
  addNewPairPeakAct: _propTypes.default.func.isRequired,
  setWorkWithMaxPeakAct: _propTypes.default.func.isRequired,
  selectPairPeakAct: _propTypes.default.func.isRequired,
  removePairPeakAct: _propTypes.default.func.isRequired,
  setUiSweepTypeAct: _propTypes.default.func.isRequired,
  sweepTypeSt: _propTypes.default.string.isRequired,
  userManualLink: _propTypes.default.string,
  jcampIdx: _propTypes.default.number
};
CyclicVoltammetryPanel.defaultProps = {
  jcampIdx: 0
};
var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(CyclicVoltammetryPanel));
exports.default = _default;