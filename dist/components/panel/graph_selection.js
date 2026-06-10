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
var _ExpandMore = _interopRequireDefault(require("@mui/icons-material/ExpandMore"));
var _styles = require("@mui/styles");
var _material = require("@mui/material");
var _curve = require("../../actions/curve");
var _list_layout = require("../../constants/list_layout");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/* eslint-disable react/function-component-definition, function-paren-newline,
react/require-default-props, react/no-unused-prop-types */

const styles = () => ({
  panelSummary: {
    backgroundColor: '#eee',
    height: 22
  },
  curveItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: '0.8em',
    padding: '6px 8px',
    margin: 0,
    cursor: 'pointer'
  },
  curveDefault: {
    backgroundColor: '#fff'
  },
  curveSelected: {
    backgroundColor: '#e0e0e0'
  },
  curveIndex: {
    flexShrink: 0,
    marginRight: '4px',
    fontStyle: 'italic'
  },
  curveLabel: {
    flexShrink: 0,
    marginRight: '8px',
    overflowWrap: 'anywhere'
  },
  colorBar: {
    flex: 1,
    height: '6px',
    borderRadius: '1px',
    minWidth: '24px',
    alignSelf: 'center'
  }
});
const fallbackName = (entityFileNames, idx) => {
  if (entityFileNames && idx < entityFileNames.length) {
    return entityFileNames[idx];
  }
  return '';
};
const displayName = (spectra, idx, entityFileNames) => spectra?.title || spectra?.feature?.title || spectra?.spectrum?.title || fallbackName(entityFileNames, idx) || `Spectrum ${idx + 1}`;
const renderCurveItem = (classes, item, curveIdx, onChange) => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.ListItem, {
  disablePadding: true,
  onClick: () => onChange(item.idx),
  className: (0, _classnames.default)(classes.curveItem, item.idx === curveIdx ? classes.curveSelected : classes.curveDefault),
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.curveIndex,
    children: item.name
  }), item.label !== '' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.curveLabel,
    children: item.label
  }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
    className: classes.colorBar,
    style: {
      backgroundColor: item.color
    }
  })]
}, item.idx);
const GraphSelectionPanel = ({
  classes,
  curveSt,
  entityFileNames,
  subLayoutsInfo,
  layoutSt,
  selectCurveAct,
  toggleShowAllCurveAct,
  expand,
  onExapnd
}) => {
  let subLayoutValues = [];
  if (subLayoutsInfo) {
    subLayoutValues = Object.keys(subLayoutsInfo);
  }
  const [selectedSubLayout, setSelectedSublayout] = (0, _react.useState)(subLayoutValues[0]);
  (0, _react.useEffect)(() => {
    setSelectedSublayout(subLayoutValues[0]);
  }, subLayoutValues);
  if (!curveSt) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {});
  }
  const {
    curveIdx,
    listCurves,
    isShowAllCurve
  } = curveSt;
  if (!listCurves) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {});
  }
  const onChange = idx => {
    selectCurveAct(idx);
  };
  const onChangeTabSubLayout = (event, newValue) => {
    setSelectedSublayout(newValue);
  };
  const onChangeSwitch = event => {
    toggleShowAllCurveAct(event.target.checked);
  };
  let itemsSubLayout = [];
  if (selectedSubLayout && subLayoutValues.length > 1) {
    const subLayout = subLayoutsInfo[selectedSubLayout];
    if (subLayout) {
      itemsSubLayout = subLayout.map((spectra, idx) => {
        const spectraIdx = spectra.curveIdx;
        const {
          color
        } = spectra;
        return {
          name: `${idx + 1}.`,
          idx: spectraIdx,
          color,
          label: displayName(spectra, spectraIdx, entityFileNames)
        };
      });
    }
  }
  const items = listCurves.map((spectra, idx) => {
    const {
      color
    } = spectra;
    return {
      name: `${idx + 1}.`,
      idx,
      color,
      label: displayName(spectra, idx, entityFileNames)
    };
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Accordion, {
    "data-testid": "GraphSelectionPanel",
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
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.AccordionSummary, {
      expandIcon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpandMore.default, {}),
      className: (0, _classnames.default)(classes.panelSummary),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Typography, {
        className: "txt-panel-header",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title'),
          children: "Graph selection"
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Divider, {}), layoutSt === _list_layout.LIST_LAYOUT.AIF ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.FormControlLabel, {
      control: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Switch, {
        checked: isShowAllCurve,
        onChange: onChangeSwitch
      }),
      label: "Show all curves"
    }) : null, subLayoutValues && subLayoutValues.length > 1 ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tabs, {
        value: selectedSubLayout,
        onChange: onChangeTabSubLayout,
        children: subLayoutValues.map((subLayout, i) => {
          let subLayoutName = '';
          switch (subLayout.toUpperCase()) {
            case 'G/MOL':
              subLayoutName = 'MWD';
              break;
            case 'MILLILITERS':
              subLayoutName = 'ELU';
              break;
            case 'INTENSITY':
              subLayoutName = 'Chromatogram';
              break;
            case 'DEGREES CELSIUS':
              subLayoutName = 'Temperature';
              break;
            default:
              break;
          }
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tab, {
            value: subLayout,
            label: subLayoutName
          }, i);
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.List, {
        children: itemsSubLayout.map(item => renderCurveItem(classes, item, curveIdx, onChange))
      })]
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.List, {
      children: items.map(item => renderCurveItem(classes, item, curveIdx, onChange))
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout,
  curveSt: state.curve
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  selectCurveAct: _curve.selectCurve,
  toggleShowAllCurveAct: _curve.toggleShowAllCurves
}, dispatch);
GraphSelectionPanel.propTypes = {
  classes: _propTypes.default.object.isRequired,
  expand: _propTypes.default.bool.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  onExapnd: _propTypes.default.func.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  selectCurveAct: _propTypes.default.func.isRequired,
  entityFileNames: _propTypes.default.array.isRequired,
  subLayoutsInfo: _propTypes.default.object,
  toggleShowAllCurveAct: _propTypes.default.func.isRequired
};
var _default = exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(GraphSelectionPanel));