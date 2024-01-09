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
var _offset = require("../../actions/offset");
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
  tRowHead: {
    backgroundColor: '#999',
    height: 32
  },
  tTxtHead: {
    color: 'white',
    padding: '5px 5px 5px 5px'
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
const createData = (classes, idx, xL, xU, difference, tmax, onDelete) => ({
  idx: idx + 1,
  xL: xL.toFixed(2),
  xU: xU.toFixed(2),
  difference: difference.toFixed(2),
  tmax: tmax.toFixed(2),
  rmBtn: /*#__PURE__*/_react.default.createElement(_HighlightOff.default, {
    onClick: onDelete,
    className: classes.rmBtn
  })
});
const offsetList = (offsets, digits, rmOneOffsetAct, classes, curveIdx) => {
  const rows = offsets.stack.map((offset, idx) => {
    const onDelete = () => {
      const payload = {
        dataToRemove: offset,
        curveIdx
      };
      rmOneOffsetAct(payload);
    };
    return createData(classes, idx, offset.xL, offset.xU, offset.difference, offset.tmax, onDelete);
  });
  return /*#__PURE__*/_react.default.createElement(_material.Table, {
    className: classes.table
  }, /*#__PURE__*/_react.default.createElement(_material.TableHead, null, /*#__PURE__*/_react.default.createElement(_material.TableRow, {
    className: classes.tRowHead
  }, /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "No."), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "Onset (\xB0C)"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "Offset (\xB0C)"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "Tmax (\xB0C)"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "W% Loss (%)"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "-"))), /*#__PURE__*/_react.default.createElement(_material.TableBody, null, rows.map(row => /*#__PURE__*/_react.default.createElement(_material.TableRow, {
    key: row.idx,
    className: classes.tRow,
    hover: true
  }, /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.idx), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.xL), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.xU), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.tmax), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.difference), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "right",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, row.rmBtn)))));
};
const OffsetPanel = _ref => {
  let {
    offsetSt,
    classes,
    expand,
    onExapnd,
    rmOneOffsetAct,
    curveSt
  } = _ref;
  const {
    selectedIdx,
    offsets
  } = offsetSt;
  const selectedOffsets = offsets[selectedIdx];
  if (!selectedOffsets) {
    return null;
  }
  const digits = 2;
  const {
    curveIdx
  } = curveSt;
  return /*#__PURE__*/_react.default.createElement(_material.Accordion, {
    "data-testid": "OffsetsPanelInfo",
    expanded: expand,
    onChange: onExapnd,
    className: (0, _classnames.default)(classes.panel),
    TransitionProps: {
      unmountOnExit: true
    }
  }, /*#__PURE__*/_react.default.createElement(_material.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null),
    className: (0, _classnames.default)(classes.panelSummary)
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    className: "txt-panel-header"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title')
  }, "Offsets"))), /*#__PURE__*/_react.default.createElement(_material.Divider, null), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.panelDetail)
  }, offsetList(selectedOffsets, digits, rmOneOffsetAct, classes, curveIdx)));
};
const mapStateToProps = (state, props) => ({
  offsetSt: state.offset.present,
  layoutSt: state.layout,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  rmOneOffsetAct: _offset.rmOneOffset
}, dispatch);
OffsetPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  offsetSt: _propTypes.default.object.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  rmOneOffsetAct: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(OffsetPanel));