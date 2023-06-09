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
var _ExpandMore = _interopRequireDefault(require("@material-ui/icons/ExpandMore"));
var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
var _core = require("@material-ui/core");
var _curve = require("../../actions/curve");
var _list_layout = require("../../constants/list_layout");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* eslint-disable react/function-component-definition, function-paren-newline,
react/require-default-props, react/no-unused-prop-types */

const styles = () => ({
  panelSummary: {
    backgroundColor: '#eee',
    height: 22
  },
  curve: {
    width: '100%'
  },
  line: {
    height: '2px',
    borderWidth: '0',
    margin: '0'
  },
  curveDefault: {
    backgroundColor: '#fff',
    fontSize: '0.8em',
    margin: '0',
    padding: '10px 2px 2px 10px'
  },
  curveSelected: {
    backgroundColor: '#2196f3',
    fontSize: '0.8em',
    color: '#fff',
    padding: '10px 2px 2px 10px'
  }
});
const GraphSelectionPanel = _ref => {
  let {
    classes,
    curveSt,
    entityFileNames,
    subLayoutsInfo,
    layoutSt,
    selectCurveAct,
    toggleShowAllCurveAct
  } = _ref;
  let subLayoutValues = [];
  if (subLayoutsInfo !== undefined && subLayoutsInfo !== null) {
    subLayoutValues = Object.keys(subLayoutsInfo);
  }
  const [selectedSubLayout, setSelectedSublayout] = (0, _react.useState)(subLayoutValues[0]);
  if (!curveSt) {
    return /*#__PURE__*/_react.default.createElement("span", null);
  }
  const {
    curveIdx,
    listCurves,
    isShowAllCurve
  } = curveSt;
  if (!listCurves) {
    return /*#__PURE__*/_react.default.createElement("span", null);
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
    itemsSubLayout = subLayout.map((spectra, idx) => {
      const spectraIdx = spectra.curveIdx;
      const {
        color
      } = spectra;
      let filename = '';
      if (entityFileNames && spectraIdx < entityFileNames.length) {
        filename = entityFileNames[spectraIdx];
      }
      return {
        name: `${idx + 1}.`,
        idx: spectraIdx,
        color,
        filename
      };
    });
  }
  const items = listCurves.map((spectra, idx) => {
    const {
      color
    } = spectra;
    let filename = '';
    if (entityFileNames && idx < entityFileNames.length) {
      filename = entityFileNames[idx];
    }
    return {
      name: `${idx + 1}.`,
      idx,
      color,
      filename
    };
  });
  return /*#__PURE__*/_react.default.createElement(_core.Accordion, {
    "data-testid": "GraphSelectionPanel"
  }, /*#__PURE__*/_react.default.createElement(_core.AccordionSummary, {
    expandIcon: /*#__PURE__*/_react.default.createElement(_ExpandMore.default, null),
    className: (0, _classnames.default)(classes.panelSummary)
  }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
    className: "txt-panel-header"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.txtBadge, 'txt-sv-panel-title')
  }, "Graph selection"))), /*#__PURE__*/_react.default.createElement(_Divider.default, null), layoutSt === _list_layout.LIST_LAYOUT.AIF ? /*#__PURE__*/_react.default.createElement(_core.FormControlLabel, {
    control: /*#__PURE__*/_react.default.createElement(_core.Switch, {
      checked: isShowAllCurve,
      onChange: onChangeSwitch
    }),
    label: "Show all curves"
  }) : null, subLayoutValues && subLayoutValues.length > 1 ? /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.Tabs, {
    value: selectedSubLayout,
    onChange: onChangeTabSubLayout
  }, subLayoutValues.map((subLayout, i) => {
    let subLayoutName = '';
    switch (subLayout) {
      case 'G/MOL':
        subLayoutName = 'MWD';
        break;
      case 'MILLILITERS':
        subLayoutName = 'ELU';
        break;
      default:
        break;
    }
    return /*#__PURE__*/_react.default.createElement(_core.Tab, {
      key: i,
      value: subLayout,
      label: subLayoutName
    });
  })), /*#__PURE__*/_react.default.createElement(_core.List, null, itemsSubLayout.map(item => /*#__PURE__*/_react.default.createElement(_core.ListItem, {
    key: item.idx,
    onClick: () => onChange(item.idx),
    className: (0, _classnames.default)(item.idx === curveIdx ? classes.curveSelected : classes.curveDefault) // eslint-disable-line
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.curve)
  }, /*#__PURE__*/_react.default.createElement("i", null, item.name), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      float: 'right',
      width: '95%'
    }
  }, /*#__PURE__*/_react.default.createElement("hr", {
    className: (0, _classnames.default)(classes.line),
    style: {
      backgroundColor: item.color
    }
  }), item.filename !== '' ? /*#__PURE__*/_react.default.createElement("span", null, "File: ", item.filename) : null // eslint-disable-line
  )))))) : /*#__PURE__*/_react.default.createElement(_core.List, null, items.map(item => /*#__PURE__*/_react.default.createElement(_core.ListItem, {
    key: item.idx,
    onClick: () => onChange(item.idx),
    className: (0, _classnames.default)(item.idx === curveIdx ? classes.curveSelected : classes.curveDefault) // eslint-disable-line
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: (0, _classnames.default)(classes.curve)
  }, /*#__PURE__*/_react.default.createElement("i", null, item.name), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      float: 'right',
      width: '95%'
    }
  }, /*#__PURE__*/_react.default.createElement("hr", {
    className: (0, _classnames.default)(classes.line),
    style: {
      backgroundColor: item.color
    }
  }), item.filename !== '' ? /*#__PURE__*/_react.default.createElement("span", null, "File: ", item.filename) : null // eslint-disable-line
  ))))));
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
  subLayoutsInfo: _propTypes.default.array,
  toggleShowAllCurveAct: _propTypes.default.func.isRequired
};
var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(GraphSelectionPanel));
exports.default = _default;