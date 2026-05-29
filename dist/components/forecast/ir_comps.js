"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IrTableHeader = exports.IrTableBodyRow = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _classnames = _interopRequireDefault(require("classnames"));
var _material = require("@mui/material");
var _CheckCircleOutline = _interopRequireDefault(require("@mui/icons-material/CheckCircleOutline"));
var _HighlightOff = _interopRequireDefault(require("@mui/icons-material/HighlightOff"));
var _comps = require("./comps");
var _forecast = require("../../actions/forecast");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable react/function-component-definition, function-paren-newline,
prefer-object-spread */

const baseSelectIrStatus = ({
  classes,
  sma,
  status,
  identity,
  setIrStatusAct
}) => {
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.FormControl, {
    size: "small",
    className: classes.ownerSelect,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Select, {
      value: theStatus,
      displayEmpty: true,
      onChange: e => {
        setIrStatusAct({
          predictions: {
            sma,
            identity,
            value: e.target.value
          },
          svgs: []
        });
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "accept",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CheckCircleOutline.default, {
          style: {
            color: '#4caf50',
            fontSize: 18
          }
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "reject",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
          style: {
            color: '#e91e63',
            fontSize: 18
          }
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          style: {
            color: '#a8b0b8',
            fontSize: 12
          },
          children: "\u2014"
        })
      })]
    })
  });
};
const bssMapStateToProps = (state, props) => (
// eslint-disable-line
{});
const bssMapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setIrStatusAct: _forecast.setIrStatus
}, dispatch);
baseSelectIrStatus.propTypes = {
  classes: _propTypes.default.object.isRequired,
  sma: _propTypes.default.string.isRequired,
  status: _propTypes.default.string,
  identity: _propTypes.default.string.isRequired,
  setIrStatusAct: _propTypes.default.func.isRequired
};
baseSelectIrStatus.defaultProps = {
  status: ''
};
const SelectIrStatus = (0, _reactRedux.connect)(bssMapStateToProps, bssMapDispatchToProps)(baseSelectIrStatus);
const IrTableHeader = classes => /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableHead, {
  children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "left",
      children: (0, _comps.TxtLabel)(classes, 'FG SMARTS', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Machine Confidence', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "center",
      children: (0, _comps.TxtLabel)(classes, 'Machine', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "center",
      children: (0, _comps.TxtLabel)(classes, 'Owner', 'txt-prd-table-title')
    })]
  })
});
exports.IrTableHeader = IrTableHeader;
const colorStyles = [{
  backgroundColor: '#fff9c4'
}, {
  backgroundColor: '#e3f2fd'
}, {
  backgroundColor: '#fce4ec'
}, {
  backgroundColor: '#e8f5e9'
}, {
  backgroundColor: '#ede7f6'
}, {
  backgroundColor: '#fff3e0'
}, {
  backgroundColor: '#e0f7fa'
}, {
  backgroundColor: '#f3e5f5'
}];
const colorLabel = (classes, idx, extClsName = 'txt-label') => {
  const style = Object.assign({}, colorStyles[idx % 8], {
    borderRadius: 6,
    display: 'inline-block',
    minWidth: 24,
    padding: '2px 6px',
    textAlign: 'center'
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    style: style,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.txtLabel, extClsName),
      children: idx + 1
    })
  });
};
const IrTableBodyRow = (classes, idx, fg) => {
  const {
    statusCell
  } = classes;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      component: "th",
      scope: "row",
      children: colorLabel(classes, idx)
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "left",
      children: (0, _comps.TxtLabel)(classes, fg.sma, 'txt-prd-table-content')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.ConfidenceLabel)(classes, fg.confidence, 'txt-prd-table-content')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "center",
      className: statusCell,
      children: (0, _comps.StatusIcon)(classes, fg.status)
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "center",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(SelectIrStatus, {
        classes: classes,
        sma: fg.sma,
        status: fg.statusOwner,
        identity: "Owner"
      })
    })]
  }, `${idx}-${fg.name}`);
};
exports.IrTableBodyRow = IrTableBodyRow;