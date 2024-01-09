"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _material = require("@mui/material");
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _styles = require("@mui/styles");
/* eslint-disable react/function-component-definition */
/* eslint-disable no-unused-vars */

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
const calculateT95AndT5 = curveData => {
  const {
    x,
    y
  } = curveData;
  const findAverageInYInterval = (targetY, tolerance) => {
    const matchingIndices = y.reduce((indices, currentY, currentIndex) => {
      if (Math.abs(currentY - targetY) <= tolerance) {
        indices.push(currentIndex);
      }
      return indices;
    }, []);
    if (matchingIndices.length === 0) {
      return null;
    }

    // eslint-disable-next-line max-len
    const averageXInInterval = matchingIndices.reduce((sum, index) => sum + x[index], 0) / matchingIndices.length;
    return averageXInInterval.toFixed(2);
  };
  const T5 = findAverageInYInterval(95, 0.002);
  const T95 = findAverageInYInterval(5, 0.002);
  return {
    T95,
    T5
  };
};
const DecompositionTemperaturePanel = _ref => {
  let {
    curveSt,
    classes,
    expand,
    onExapnd
  } = _ref;
  const {
    listCurves
  } = curveSt;
  if (!listCurves || listCurves.length === 0) {
    return null;
  }
  const weightCurve = listCurves.find(curve => curve.feature.yUnit.toLowerCase().includes('weight') && !curve.feature.yUnit.toLowerCase().includes('deriv'));
  if (!weightCurve) {
    return null;
  }
  const {
    feature
  } = weightCurve;
  const {
    T95,
    T5
  } = calculateT95AndT5(feature.data[0]);
  return /*#__PURE__*/_react.default.createElement(_material.Accordion, {
    "data-testid": "TemperaturePanelInfo",
    expanded: expand,
    onChange: onExapnd,
    className: (0, _classnames.default)(classes.panel),
    TransitionProps: {
      unmountOnExit: true
    }
  }, /*#__PURE__*/_react.default.createElement(_material.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null)
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, null, "Decomposition Temperatures")), /*#__PURE__*/_react.default.createElement(_material.Divider, null), /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _classnames.default)(classes.panelDetail)
  }, /*#__PURE__*/_react.default.createElement(_material.Table, {
    className: classes.table
  }, /*#__PURE__*/_react.default.createElement(_material.TableHead, null, /*#__PURE__*/_react.default.createElement(_material.TableRow, {
    className: classes.tRowHead
  }, /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "center",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "T", /*#__PURE__*/_react.default.createElement("sub", null, "5%"), "(\xB0C)"), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "center",
    className: (0, _classnames.default)(classes.tTxtHead, 'txt-sv-panel-head')
  }, "T", /*#__PURE__*/_react.default.createElement("sub", null, "95%"), "(\xB0C)"))), /*#__PURE__*/_react.default.createElement(_material.TableBody, null, /*#__PURE__*/_react.default.createElement(_material.TableRow, {
    className: classes.tRow,
    hover: true
  }, /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "center",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, T5), /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    align: "center",
    className: (0, _classnames.default)(classes.tTxt, 'txt-sv-panel-txt')
  }, T95))))));
};
const mapStateToProps = (state, props) => ({
  curveSt: state.curve
});
DecompositionTemperaturePanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  onExapnd: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps)((0, _styles.withStyles)(styles)(DecompositionTemperaturePanel));