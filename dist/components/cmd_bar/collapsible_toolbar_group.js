"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.COLLAPSE_THRESHOLD = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _ChevronRight = _interopRequireDefault(require("@mui/icons-material/ChevronRight"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _styles = require("@mui/styles");
var _common = require("./common");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/* eslint-disable react/function-component-definition, react/require-default-props,
react/jsx-props-no-spreading */

const COLLAPSE_THRESHOLD = exports.COLLAPSE_THRESHOLD = 4;
const styles = () => ({
  groupItemsShell: {
    display: 'inline-flex',
    overflow: 'hidden',
    transition: 'max-width 260ms ease, opacity 200ms ease'
  },
  groupItemsCollapsed: {
    maxWidth: 0,
    opacity: 0
  },
  groupItemsExpanded: {
    maxWidth: 720,
    opacity: 1
  },
  groupItemsTrack: {
    alignItems: 'flex-end',
    display: 'inline-flex',
    flexWrap: 'nowrap',
    gap: _common.TOOLBAR_GROUP_GAP,
    whiteSpace: 'nowrap'
  },
  groupChevron: {
    fontSize: 20,
    transition: 'transform 220ms ease'
  },
  groupChevronExpanded: {
    transform: 'rotate(90deg)'
  }
});
const countItems = children => _react.default.Children.toArray(children).filter(child => child != null && child !== false).length;
const CollapsibleToolbarGroup = ({
  classes,
  className,
  children,
  collapseThreshold,
  ...rest
}) => {
  const itemCount = countItems(children);
  const isCollapsible = itemCount > collapseThreshold;
  const [expanded, setExpanded] = (0, _react.useState)(false);
  if (!isCollapsible) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: className,
      ...rest,
      children: children
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
    className: className,
    ...rest,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
      title: expanded ? 'Replier' : 'Déplier',
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_common.MuButton, {
          className: "btn-sv-bar-group-toggle",
          onClick: () => setExpanded(prev => !prev),
          "aria-expanded": expanded,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChevronRight.default, {
            className: (0, _classnames.default)(classes.groupChevron, expanded && classes.groupChevronExpanded)
          })
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: (0, _classnames.default)(classes.groupItemsShell, expanded ? classes.groupItemsExpanded : classes.groupItemsCollapsed),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: classes.groupItemsTrack,
        children: children
      })
    })]
  });
};
CollapsibleToolbarGroup.propTypes = {
  classes: _propTypes.default.object.isRequired,
  className: _propTypes.default.string,
  children: _propTypes.default.node,
  collapseThreshold: _propTypes.default.number
};
CollapsibleToolbarGroup.defaultProps = {
  collapseThreshold: COLLAPSE_THRESHOLD
};
var _default = exports.default = (0, _styles.withStyles)(styles)(CollapsibleToolbarGroup);