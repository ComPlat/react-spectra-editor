"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _reactDropzone = _interopRequireDefault(require("react-dropzone"));
var _core = require("@material-ui/core");
var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));
var _HighlightOff = _interopRequireDefault(require("@material-ui/icons/HighlightOff"));
var _Table = _interopRequireDefault(require("@material-ui/core/Table"));
var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));
var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));
var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _Tooltip = _interopRequireDefault(require("@material-ui/core/Tooltip"));
var _VisibilityOutlined = _interopRequireDefault(require("@material-ui/icons/VisibilityOutlined"));
var _VisibilityOffOutlined = _interopRequireDefault(require("@material-ui/icons/VisibilityOffOutlined"));
var _styles = require("@material-ui/core/styles");
var _format = _interopRequireDefault(require("../../helpers/format"));
var _jcamp = require("../../actions/jcamp");
/* eslint-disable function-paren-newline, react/jsx-props-no-spreading,
react/function-component-definition */

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
  tTxt: {
    padding: 0
  },
  tTxtHide: {
    color: '#D5D8DC'
  },
  tRow: {
    height: 28,
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.background.default
    }
  },
  rmBtn: {
    color: 'red',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'red',
      color: 'white'
    }
  },
  showBtn: {
    color: 'steelblue',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'steelblue',
      color: 'white'
    }
  },
  hideBtn: {
    color: 'gray',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'gray',
      color: 'white'
    }
  },
  square: {
    textAlign: 'center !important'
  },
  baseDD: {
    backgroundColor: 'white',
    border: '1px dashed black',
    borderRadius: 5,
    height: 26,
    lineHeight: '26px',
    margin: '7px 0 7px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%'
  },
  enableDD: {
    border: '2px dashed #000',
    color: '#000'
  },
  disableDD: {
    border: '2px dashed #aaa',
    color: '#aaa'
  },
  tpCard: {},
  tpMoreTxt: {
    padding: '0 0 0 60px'
  },
  tpLabel: {
    fontSize: 16
  }
});
const msgDefault = 'Add spectra to compare.';
const tpHint = classes => /*#__PURE__*/_react.default.createElement("span", {
  className: (0, _classnames.default)(classes.tpCard)
}, /*#__PURE__*/_react.default.createElement("p", {
  className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp')
}, "- Accept *.dx, *.jdx, *.JCAMP,"), /*#__PURE__*/_react.default.createElement("p", {
  className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp')
}, "- Max 5 spectra."));
const content = (classes, desc) => /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
  title: tpHint(classes),
  placement: "bottom"
}, /*#__PURE__*/_react.default.createElement("span", {
  className: (0, _classnames.default)(classes.tpLabel, 'txt-sv-tp')
}, desc));
const inputOthers = (classes, jcampSt) => {
  const {
    selectedIdx,
    jcamps
  } = jcampSt;
  const selectedJcamp = jcamps[selectedIdx];
  const {
    addOthersCb
  } = selectedJcamp;
  const fileName = '';
  const desc = fileName || msgDefault;
  const onDrop = jcampFiles => {
    if (!addOthersCb) return;
    addOthersCb({
      jcamps: jcampFiles
    });
  };
  return /*#__PURE__*/_react.default.createElement(_reactDropzone.default, {
    className: "dropbox",
    onDrop: onDrop
  }, _ref => {
    let {
      getRootProps,
      getInputProps
    } = _ref;
    return /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({}, getRootProps(), {
      className: (0, _classnames.default)(classes.baseDD)
    }), /*#__PURE__*/_react.default.createElement("input", getInputProps()), content(classes, desc));
  });
};
const compareList = (classes, jcampSt, rmOthersOneAct, toggleShowAct) => {
  const {
    selectedIdx,
    jcamps
  } = jcampSt;
  const selectedJcamp = jcamps[selectedIdx];
  const {
    others
  } = selectedJcamp;
  const rows = others.map((o, idx) => ({
    idx,
    title: o.spectra[0].title,
    color: _format.default.compareColors(idx),
    rmCb: () => rmOthersOneAct(idx),
    isShow: o.show,
    toggleShowCb: () => toggleShowAct(idx)
  }));
  return /*#__PURE__*/_react.default.createElement(_Table.default, {
    className: classes.table
  }, /*#__PURE__*/_react.default.createElement(_TableBody.default, null, rows.map(row => /*#__PURE__*/_react.default.createElement(_TableRow.default, {
    key: row.idx,
    className: classes.tRow,
    hover: true
  }, /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, classes.square, 'txt-sv-panel-txt'),
    style: {
      backgroundColor: row.color
    }
  }, row.idx + 1), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt', row.isShow ? null : classes.tTxtHide)
  }, row.title), /*#__PURE__*/_react.default.createElement(_TableCell.default, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.isShow ? /*#__PURE__*/_react.default.createElement(_VisibilityOutlined.default, {
    onClick: row.toggleShowCb,
    className: classes.showBtn
  }) : /*#__PURE__*/_react.default.createElement(_VisibilityOffOutlined.default, {
    onClick: row.toggleShowCb,
    className: classes.hideBtn
  }), /*#__PURE__*/_react.default.createElement(_HighlightOff.default, {
    onClick: row.rmCb,
    className: classes.rmBtn
  }))))));
};
const ComparePanel = _ref2 => {
  let {
    classes,
    expand,
    onExapnd,
    jcampSt,
    rmOthersOneAct,
    toggleShowAct
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(_core.Accordion, {
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
  }, "Spectra Comparisons"))), /*#__PURE__*/_react.default.createElement(_Divider.default, null), inputOthers(classes, jcampSt), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.panelDetail)
  }, compareList(classes, jcampSt, rmOthersOneAct, toggleShowAct)));
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  jcampSt: state.jcamp
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  rmOthersOneAct: _jcamp.rmOthersOne,
  toggleShowAct: _jcamp.toggleShow
}, dispatch);
ComparePanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  jcampSt: _propTypes.default.object.isRequired,
  rmOthersOneAct: _propTypes.default.func.isRequired,
  toggleShowAct: _propTypes.default.func.isRequired
};
var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(ComparePanel));
exports.default = _default;