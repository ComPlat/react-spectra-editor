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
  btnAddRow: {
    color: 'green'
  },
  tTxt: {
    padding: 5
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
  return /*#__PURE__*/_react.default.createElement(_material.Accordion, {
    "data-testid": "PanelVoltammetry"
  }, /*#__PURE__*/_react.default.createElement(_material.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null),
    className: (0, _classnames.default)(classes.panelSummary)
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    className: "txt-panel-header"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title')
  }, "Voltammetry data"))), /*#__PURE__*/_react.default.createElement(_material.Divider, null), /*#__PURE__*/_react.default.createElement(_material.Table, {
    className: classes.table
  }, /*#__PURE__*/_react.default.createElement(_material.TableHead, null, /*#__PURE__*/_react.default.createElement(_material.TableRow, null, /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "Ref"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "Anodic"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "Cathodic"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "I ", /*#__PURE__*/_react.default.createElement("sub", null, "\u03BB0"), /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: /*#__PURE__*/_react.default.createElement("p", {
      className: (0, _classnames.default)(classes.txtToolTip)
    }, "Baseline correction value for I ratio ", /*#__PURE__*/_react.default.createElement("br", null), "(a.k.a y value of pecker)")
  }, /*#__PURE__*/_react.default.createElement(_Info.default, {
    className: (0, _classnames.default)(classes.infoIcon)
  }))), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "I ratio", /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _classnames.default)(classes.txtToolTip)
    }, /*#__PURE__*/_react.default.createElement("p", null, "Nicholson's method"), /*#__PURE__*/_react.default.createElement("i", null, "NICHOLSON, Rl S. Semiempirical Procedure for Measuring with Stationary Electrode Polarography Rates of Chemical Reactions Involving the Product of Electron Transfer. Analytical Chemistry, 1966, 38. Jg., Nr. 10, S. 1406-1406. https://doi.org/10.1021/ac60242a030"))
  }, /*#__PURE__*/_react.default.createElement(_Info.default, {
    className: (0, _classnames.default)(classes.infoIcon)
  }))), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "E", /*#__PURE__*/_react.default.createElement("sub", null, "1/2")), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, "\u0394E", /*#__PURE__*/_react.default.createElement("sub", null, "p"), /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
    title: /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)(classes.txtToolTip)
    }, "| Epa - Epc |")
  }, /*#__PURE__*/_react.default.createElement(_Info.default, {
    className: (0, _classnames.default)(classes.infoIcon)
  }))), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, /*#__PURE__*/_react.default.createElement(_AddCircleOutline.default, {
    onClick: () => addNewPairPeakAct(jcampIdx),
    className: (0, _classnames.default)(classes.btnAddRow)
  })))), /*#__PURE__*/_react.default.createElement(_material.TableBody, null, rows.map(row => /*#__PURE__*/_react.default.createElement(_material.TableRow, {
    key: row.idx
  }, /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, /*#__PURE__*/_react.default.createElement(_material.Checkbox, {
    checked: row.isRef,
    onChange: row.onCheckRefChanged
  })), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
    onClick: row.onClickMax
  }, row.max.split('\n').map((s, index) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
    key: index
  }, s, /*#__PURE__*/_react.default.createElement("br", null)))), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, !spectra.isWorkMaxPeak && spectra.selectedIdx === row.idx ? classes.cellSelected : 'txt-sv-panel-txt'),
    onClick: row.onClickMin
  }, row.min.split('\n').map((s, index) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
    key: index
  }, s, /*#__PURE__*/_react.default.createElement("br", null)))), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, row.pecker), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, row.ratio), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, row.e12), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, row.delta), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "left",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt')
  }, /*#__PURE__*/_react.default.createElement(_RemoveCircle.default, {
    className: (0, _classnames.default)(classes.btnRemove),
    onClick: row.remove
  })))))), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.rowRoot, classes.rowEven)
  }, /*#__PURE__*/_react.default.createElement(_material.Tooltip, {
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
  selectRefPeaksAct: _cyclic_voltammetry.selectRefPeaks,
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