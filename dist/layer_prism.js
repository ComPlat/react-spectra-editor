"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _styles = require("@mui/styles");
var _index = _interopRequireDefault(require("./components/panel/index"));
var _index2 = _interopRequireDefault(require("./components/cmd_bar/index"));
var _layer_content = _interopRequireDefault(require("./layer_content"));
var _list_ui = require("./constants/list_ui");
var _extractParams = require("./helpers/extractParams");
var _list_graph = require("./constants/list_graph");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/* eslint-disable prefer-object-spread, default-param-last,
react/function-component-definition, react/require-default-props
*/

const styles = () => ({});
const getThresholdState = state => {
  const curveIdx = state?.curve?.curveIdx;
  const thresholdList = state?.threshold?.list;
  if (!Array.isArray(thresholdList)) return {};
  if (!Number.isInteger(curveIdx)) return thresholdList[0] || {};
  return thresholdList[curveIdx] || thresholdList[0] || {};
};

// A host that rebuilds `entity` as a fresh object literal on every render
// (no memoization on its side) must not hand ViewerLine (via extractParams'
// `feature`) a brand-new object every single time regardless of whether the
// underlying data changed - ViewerLine.normChange dispatches MANAGER.RESETALL
// whenever `feature`'s reference changes, and that cascades into a fresh
// state.threshold reference, causing LayerPrism to re-render and rebuild
// `feature` again, and so on, once per host render. Since `entity` can carry
// large spectral data arrays, avoid stringifying it wholesale; digest only
// each data block's length/first/last on BOTH axes.
//
// Unlike LayerInit's own (lower-stakes) entitySignature helper - which only
// gates whether to re-dispatch a redux init action, so a false "unchanged"
// merely skips a re-init - this signature directly gates what actually gets
// RENDERED, so it must not collide between two genuinely different entities.
// An X-only, first-spectrum-only digest is not safe enough for that: many
// instrument types (IR in particular) resample every measurement onto the
// same standardized wavenumber grid, so two completely different samples
// can share identical x length/head/tail while their y (measured) values
// differ - and an entity's actually-displayed data is not always its first
// spectra entry (an MS-layout entity's topic comes from spectra[scanIdx],
// selected by getScanIdx, not spectra[0]). Digest every spectrum block (not
// just the first) and both axes, plus the feature blocks extractParams
// itself reads (autoPeak/editPeak), so a mismatch anywhere in what
// extractParams actually consumes invalidates the cache.
const dataBlockDigest = data0 => {
  if (!data0) return 'none';
  const xs = Array.isArray(data0.x) ? data0.x : [];
  const ys = Array.isArray(data0.y) ? data0.y : [];
  return `${xs.length}:${xs[0]}:${xs[xs.length - 1]}:${ys.length}:${ys[0]}:${ys[ys.length - 1]}`;
};
const entitySignature = e => {
  if (!e) return 'none';
  const id = e.idDt ?? e.id ?? e.datasetId;
  const spectraDigest = Array.isArray(e.spectra) ? e.spectra.map(s => dataBlockDigest(s?.data?.[0])).join(';') : 'none';
  const features = e.features && typeof e.features === 'object' && !Array.isArray(e.features) ? e.features : {};
  const autoDigest = dataBlockDigest(features.autoPeak?.data?.[0]);
  const editDigest = dataBlockDigest(features.editPeak?.data?.[0]);
  return `${e.layout || ''}|${e.title || ''}|id:${id ?? ''}|sp:${spectraDigest}|auto:${autoDigest}|edit:${editDigest}`;
};
const useExtractedParams = (entity, thresSt, scanSt) => {
  const signature = `${entitySignature(entity)}|${JSON.stringify(thresSt)}|${JSON.stringify(scanSt)}`;
  const cacheRef = (0, _react.useRef)(null);
  if (!cacheRef.current || cacheRef.current.signature !== signature) {
    cacheRef.current = {
      signature,
      result: (0, _extractParams.extractParams)(entity, thresSt, scanSt)
    };
  }
  return cacheRef.current.result;
};
const LayerPrism = ({
  entity,
  cLabel,
  xLabel,
  yLabel,
  forecast,
  operations,
  descriptions,
  molSvg,
  editorOnly,
  exactMass,
  thresSt,
  scanSt,
  uiSt,
  curveSt,
  integrationSt,
  canChangeDescription,
  onDescriptionChanged,
  entityFileNames,
  userManualLink
}) => {
  const {
    topic,
    feature,
    hasEdit,
    integration: initialIntegration,
    features
  } = useExtractedParams(entity, thresSt, scanSt);
  if (!topic) return null;
  const curveIdx = curveSt && Number.isFinite(curveSt.curveIdx) ? curveSt.curveIdx : 0;
  const liveIntegrations = integrationSt && Array.isArray(integrationSt.integrations) ? integrationSt.integrations : null;
  const liveIntegration = liveIntegrations ? liveIntegrations[curveIdx] : null;
  const integration = liveIntegration || initialIntegration;
  const {
    viewer
  } = uiSt;
  if (viewer === _list_ui.LIST_UI_VIEWER_TYPE.ANALYSIS) {
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.default, {
        feature: feature,
        hasEdit: hasEdit,
        forecast: forecast,
        operations: operations,
        editorOnly: editorOnly
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: _list_graph.LIST_HOST_HOOK_CLASS.EDITOR_ROOT,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          container: true,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
            item: true,
            xs: 12,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_layer_content.default, {
              topic: topic,
              feature: feature,
              features: features || [],
              cLabel: cLabel,
              xLabel: xLabel,
              yLabel: yLabel,
              forecast: forecast,
              operations: operations
            })
          })
        })
      })]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_index2.default, {
      feature: feature,
      hasEdit: hasEdit,
      forecast: forecast,
      operations: operations,
      editorOnly: editorOnly
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: _list_graph.LIST_HOST_HOOK_CLASS.EDITOR_ROOT,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Grid.default, {
        container: true,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 9,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_layer_content.default, {
            topic: topic,
            feature: feature,
            features: features || [],
            cLabel: cLabel,
            xLabel: xLabel,
            yLabel: yLabel,
            forecast: forecast,
            operations: operations
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
          item: true,
          xs: 3,
          align: "center",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_index.default, {
            feature: feature,
            integration: integration,
            editorOnly: editorOnly,
            molSvg: molSvg,
            exactMass: exactMass,
            entityFileNames: entityFileNames,
            userManualLink: userManualLink,
            descriptions: descriptions,
            canChangeDescription: canChangeDescription,
            onDescriptionChanged: onDescriptionChanged
          })
        })]
      })
    })]
  });
};
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  scanSt: state.scan,
  thresSt: getThresholdState(state),
  uiSt: state.ui,
  curveSt: state.curve,
  integrationSt: state.integration.present
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({}, dispatch);
LayerPrism.propTypes = {
  entity: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  exactMass: _propTypes.default.string,
  forecast: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  thresSt: _propTypes.default.object.isRequired,
  scanSt: _propTypes.default.object.isRequired,
  uiSt: _propTypes.default.object.isRequired,
  curveSt: _propTypes.default.object.isRequired,
  integrationSt: _propTypes.default.object.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  entityFileNames: _propTypes.default.array,
  userManualLink: _propTypes.default.object
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerPrism)); // eslint-disable-line