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

// import SmaToSvg from '../common/chem';
const baseSelectIrStatus = _ref => {
  let {
    sma,
    status,
    identity,
    curveIdx,
    setIrStatusAct
  } = _ref;
  const theStatus = ['accept', 'reject'].includes(status) ? status : '';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.FormControl, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Select, {
      value: theStatus,
      onChange: e => {
        setIrStatusAct({
          predictions: {
            sma,
            identity,
            value: e.target.value
          },
          svgs: [],
          curveIdx
        });
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "accept",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CheckCircleOutline.default, {
          style: {
            color: '#4caf50'
          }
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "reject",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightOff.default, {
          style: {
            color: '#e91e63'
          }
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.MenuItem, {
        value: "",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {})
      })]
    })
  });
};
const bssMapStateToProps = (state, props) => (
// eslint-disable-line
{
  curveIdx: state.curve.curveIdx
});
const bssMapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  setIrStatusAct: _forecast.setIrStatus
}, dispatch);
baseSelectIrStatus.propTypes = {
  sma: _propTypes.default.string.isRequired,
  status: _propTypes.default.string,
  identity: _propTypes.default.string.isRequired,
  curveIdx: _propTypes.default.number.isRequired,
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
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Machine', 'txt-prd-table-title')
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
      align: "right",
      children: (0, _comps.TxtLabel)(classes, 'Owner', 'txt-prd-table-title')
    })]
  })
});
exports.IrTableHeader = IrTableHeader;
const colorStyles = [{
  backgroundColor: '#FFFF00'
}, {
  backgroundColor: '#87CEFA'
}, {
  backgroundColor: '#FFB6C1'
}, {
  backgroundColor: '#00FF00'
}, {
  backgroundColor: '#E6E6FA'
}, {
  backgroundColor: '#FFD700'
}, {
  backgroundColor: '#F0FFFF'
}, {
  backgroundColor: '#F5F5DC'
}];
const colorLabel = function colorLabel(classes, idx) {
  let extClsName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'txt-label';
  const style = Object.assign({}, colorStyles[idx % 8], {
    width: 20,
    borderRadius: 20,
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
const IrTableBodyRow = (classes, idx, fg) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.TableRow, {
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
    align: "right",
    children: (0, _comps.StatusIcon)(fg.status)
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.TableCell, {
    align: "right",
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(SelectIrStatus, {
      sma: fg.sma,
      status: fg.statusOwner,
      identity: "Owner"
    })
  })]
}, `${idx}-${fg.name}`);
exports.IrTableBodyRow = IrTableBodyRow;