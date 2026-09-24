"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _redux = require("redux");
var _styles = require("@mui/styles");
var _submit = require("./actions/submit");
var _layout = require("./actions/layout");
var _manager = require("./actions/manager");
var _meta = require("./actions/meta");
var _jcamp = require("./actions/jcamp");
var _layer_prism = _interopRequireDefault(require("./layer_prism"));
var _format = _interopRequireDefault(require("./helpers/format"));
var _entity_signature = require("./helpers/entity_signature");
var _extractEntityLCMS = require("./helpers/extractEntityLCMS");
var _timeAxis = require("./features/lc-ms/entities/timeAxis");
var _multi_jcamps_viewer = _interopRequireDefault(require("./components/multi_jcamps_viewer"));
var _hplc_viewer = _interopRequireDefault(require("./components/hplc_viewer"));
var _curve = require("./actions/curve");
var _hplc_ms = require("./actions/hplc_ms");
var _list_layout = require("./constants/list_layout");
var _jsxRuntime = require("react/jsx-runtime");
/* eslint-disable prefer-object-spread, default-param-last */

const styles = () => ({});
class LayerInit extends _react.default.Component {
  constructor(props) {
    super(props);
    this.normChange = this.normChange.bind(this);
    this.execReset = this.execReset.bind(this);
    this.initReducer = this.initReducer.bind(this);
    this.updateOthers = this.updateOthers.bind(this);
    this.updateMultiEntities = this.updateMultiEntities.bind(this);
    // Review finding S5 (PR #336): a layout the user picks by hand (the dropdown
    // dispatches updateLayoutAct directly, bypassing execReset) for an
    // unrecognized-datatype entity, keyed to that entity's dataset id. See
    // componentDidUpdate and execReset for why this can't just be read back from
    // Redux state.layout at the point execReset needs it.
    this.manualLayoutOverride = null;
  }
  componentDidMount() {
    this.execReset();
    this.initReducer();
    this.updateOthers();
    this.updateMultiEntities();
  }
  componentDidUpdate(prevProps) {
    const {
      others,
      multiEntities,
      entity,
      operations,
      layoutSt
    } = this.props;
    const entityChanged = (0, _entity_signature.entitySignature)(prevProps.entity) !== (0, _entity_signature.entitySignature)(entity);
    // Review finding S5 (PR #336): state.layout changing to something other than
    // PLAIN while the entity itself did not is the user picking a layout by hand
    // (the dropdown dispatches updateLayoutAct directly -- the only other place
    // that happens for an entity execReset would otherwise force to PLAIN).
    // Remember it against this dataset so a later refresh of the SAME dataset can
    // restore it -- see execReset for why reading state.layout back live at that
    // point doesn't work. Excluding a transition *to* PLAIN here is deliberate: a
    // child's RESETALL (dispatched on its own mount, independent of any entity
    // change -- see the ForecastViewer-swap note in the S5 test file) carries this
    // still-unrecognized entity's own static PLAIN classification and can clobber
    // a just-recorded pick back to PLAIN in the very same tick; that must not
    // overwrite the real pick this override exists to remember.
    const entityIsUnrecognized = !entity?.layout || _format.default.isPlainLayout(entity.layout);
    if (!entityChanged && prevProps.layoutSt !== layoutSt && entityIsUnrecognized && layoutSt !== _list_layout.LIST_LAYOUT.PLAIN) {
      const datasetId = entity?.idDt ?? entity?.id ?? entity?.datasetId;
      if (datasetId != null) {
        this.manualLayoutOverride = {
          datasetId,
          layout: layoutSt
        };
      }
    }
    this.normChange(prevProps, entityChanged);
    if (prevProps.operations !== operations || entityChanged) {
      this.initReducer();
    }
    if (prevProps.others !== others) {
      this.updateOthers();
    }
    if ((0, _entity_signature.multiEntitiesSignature)(prevProps.multiEntities) !== (0, _entity_signature.multiEntitiesSignature)(multiEntities) || entityChanged) {
      this.updateMultiEntities();
    }
  }
  normChange(prevProps, entityChanged) {
    const {
      entity,
      multiEntities,
      clearHplcMsStateAct
    } = this.props;
    if (entityChanged) {
      const prevIsLcms = _format.default.isLCMsLayout(prevProps.entity?.layout);
      const nextIsLcms = _format.default.isLCMsLayout(entity?.layout);
      const lcmsSessionActive = prevIsLcms && nextIsLcms && Array.isArray(multiEntities) && (0, _extractEntityLCMS.isLcMsGroup)(multiEntities);
      if ((prevIsLcms || nextIsLcms) && !lcmsSessionActive) {
        const prevSig = (0, _entity_signature.entitySignature)(prevProps.entity);
        const nextSig = (0, _entity_signature.entitySignature)(entity);
        if (prevSig !== nextSig) {
          clearHplcMsStateAct();
        }
      }
      this.execReset();
    }
  }
  execReset() {
    const {
      entity,
      updateMetaPeaksAct,
      resetInitCommonAct,
      resetInitMsAct,
      resetInitNmrAct,
      resetInitCommonWithIntergationAct,
      resetDetectorAct,
      updateDSCMetaDataAct,
      resetMultiplicityAct,
      updateLayoutAct
    } = this.props;
    if (!entity) return;
    resetInitCommonAct();
    resetDetectorAct();
    const {
      layout: rawLayout,
      features = {}
    } = entity;
    // helpers/chem.js's readLayout() itself now returns PLAIN (not a falsy
    // value) for a datatype it does not recognise, so entity.layout is
    // already normalized for anything built via FN.ExtractJcamp. This is
    // belt-and-suspenders for a host-constructed entity that skips that
    // classifier and hands us a falsy layout directly -- it must not inherit
    // whatever layout was previously in the Redux state slice either.
    //
    // Review finding S5 (PR #336): that normalization must not clobber a layout
    // the user picked by hand for THIS SAME dataset. A host that keys the editor
    // by dataset (chemotion_ELN does) can pass a refreshed entity for an
    // unrecognized datatype without remounting -- entitySignature still changes
    // (new content), execReset still runs, and naively PLAIN would land back over
    // that manual choice on every such refresh.
    //
    // This can't be answered by reading this.props.layoutSt here: ViewerLine (a
    // descendant, whose componentDidUpdate fires before this one) independently
    // dispatches RESETALL whenever the `feature` prop it's handed changes
    // reference -- which a refreshed entity's new content digest also does --
    // carrying that entity's own (still PLAIN) operation.layout. That RESETALL
    // already overwrote state.layout back to PLAIN by the time this line runs, so
    // this.props.layoutSt is exactly the value being raced, not a usable source
    // of truth. manualLayoutOverride is written only from componentDidUpdate's own
    // observation of a *prior*, separate commit where layoutSt changed with no
    // entity change -- immune to this commit's race -- and is what restores the
    // choice after that RESETALL clobbers it.
    const datasetId = entity.idDt ?? entity.id ?? entity.datasetId;
    const override = datasetId != null && this.manualLayoutOverride?.datasetId === datasetId ? this.manualLayoutOverride.layout : null;
    // rawLayout is 'PLAIN', not falsy, for anything built via readLayout -- so
    // `rawLayout || ...` alone never reaches the override or host-constructed-entity
    // fallback below. Both must be treated as "unrecognized, override-eligible".
    const isUnrecognized = !rawLayout || _format.default.isPlainLayout(rawLayout);
    const layout = isUnrecognized ? override || _list_layout.LIST_LAYOUT.PLAIN : rawLayout;
    updateLayoutAct(layout);
    if (_format.default.isMsLayout(layout)) {
      // const { autoPeak, editPeak } = features; // TBD
      const autoPeak = features.autoPeak || features[0];
      const editPeak = features.editPeak || features[0];
      const baseFeat = editPeak || autoPeak;
      resetInitMsAct(baseFeat);
    } else if (_format.default.isNmrLayout(layout)) {
      const {
        integration,
        multiplicity,
        simulation
      } = features;
      updateMetaPeaksAct(entity);
      resetInitNmrAct({
        integration,
        multiplicity,
        simulation
      });
    } else if (_format.default.isHplcUvVisLayout(layout)) {
      const {
        integration
      } = features;
      updateMetaPeaksAct(entity);
      resetInitCommonWithIntergationAct({
        integration
      });
    } else if (_format.default.isDSCLayout(layout)) {
      const {
        dscMetaData
      } = features;
      updateDSCMetaDataAct(dscMetaData);
    } else if (_format.default.isPlainLayout(layout)) {
      // Review finding S3 (PR #336): this used to fall into the generic `else`
      // below, which only resets multiplicity. buildIntegFeature/buildMpyFeature/
      // buildSimFeature always return a truthy object (with empty stacks) even for
      // a PLAIN entity, so integration/multiplicity/simulation from whatever was
      // PREVIOUSLY open at this curveIdx survived untouched -- invisible in the UI
      // (which hides integrals for PLAIN) but still read by the host's
      // submit/export path and saved against the PLAIN spectrum. Reset the same
      // per-curve slices the NMR branch above does, plus DSC metadata, which is
      // equally stale-prone and equally invisible here.
      const {
        integration,
        multiplicity,
        simulation
      } = features;
      updateMetaPeaksAct(entity);
      resetInitNmrAct({
        integration,
        multiplicity,
        simulation
      });
      updateDSCMetaDataAct(undefined);
    } else {
      resetMultiplicityAct();
    }
  }
  initReducer() {
    const {
      operations,
      updateOperationAct
    } = this.props;
    if (Array.isArray(operations) && operations.length > 0) {
      updateOperationAct(operations[0]);
    }
  }
  updateOthers() {
    const {
      others,
      addOthersAct
    } = this.props;
    if (others) {
      addOthersAct(others);
    }
  }
  updateMultiEntities() {
    const {
      multiEntities,
      setAllCurvesAct,
      entity
    } = this.props;
    if (!entity) return;
    const lcmsCurveMeta = () => {
      const uvvisFromMulti = Array.isArray(multiEntities) ? multiEntities.find(e => (0, _extractEntityLCMS.getLcMsInfo)(e).kind === 'uvvis') : null;
      const mzFromMulti = Array.isArray(multiEntities) ? multiEntities.find(e => (0, _extractEntityLCMS.getLcMsInfo)(e).kind === 'mz') : null;
      const idDt = uvvisFromMulti?.idDt ?? uvvisFromMulti?.id ?? uvvisFromMulti?.datasetId ?? entity?.idDt ?? entity?.id ?? entity?.datasetId ?? null;
      const lcmsUvvisWavelength = entity?.lcms_uvvis_wavelength ?? entity?.lcmsUvvisWavelength ?? uvvisFromMulti?.lcms_uvvis_wavelength ?? uvvisFromMulti?.lcmsUvvisWavelength;
      const lcmsMzPage = entity?.lcms_mz_page ?? entity?.lcmsMzPage ?? mzFromMulti?.lcms_mz_page ?? mzFromMulti?.lcmsMzPage ?? uvvisFromMulti?.lcms_mz_page ?? uvvisFromMulti?.lcmsMzPage;
      const mzInfo = mzFromMulti ? (0, _extractEntityLCMS.getLcMsInfo)(mzFromMulti) : null;
      const lcmsPolarity = entity?.lcms_polarity ?? entity?.lcmsPolarity ?? entity?.ticPolarity ?? mzFromMulti?.lcms_polarity ?? mzFromMulti?.lcmsPolarity ?? (mzInfo?.kind === 'mz' ? mzInfo.polarity : null);
      const out = {};
      if (idDt != null) out.idDt = idDt;
      if (lcmsUvvisWavelength != null && lcmsUvvisWavelength !== '') {
        out.lcmsUvvisWavelength = lcmsUvvisWavelength;
      }
      if (lcmsMzPage != null && lcmsMzPage !== '') {
        out.lcmsMzPage = lcmsMzPage;
      }
      if (lcmsPolarity != null && lcmsPolarity !== '') {
        out.lcmsPolarity = lcmsPolarity;
      }
      return Object.keys(out).length ? out : undefined;
    };
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isMultiSpectra) {
      const meta = _format.default.isLCMsLayout(entity.layout) ? lcmsCurveMeta() : undefined;
      setAllCurvesAct((0, _timeAxis.reconcileLcMsTimeAxes)(multiEntities), meta);
      return;
    }
    if (_format.default.isLCMsLayout(entity.layout)) {
      const payload = Array.isArray(multiEntities) && multiEntities.length > 0 ? multiEntities : [entity];
      setAllCurvesAct((0, _timeAxis.reconcileLcMsTimeAxes)(payload), lcmsCurveMeta());
      return;
    }
    if (_format.default.isCyclicVoltaLayout(entity.layout)) {
      const payload = Array.isArray(multiEntities) && multiEntities.length > 0 ? multiEntities : [entity];
      setAllCurvesAct(payload);
      return;
    }
    setAllCurvesAct(false);
  }
  render() {
    const {
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
      canChangeDescription,
      onDescriptionChanged,
      multiEntities,
      entityFileNames,
      userManualLink,
      onLcmsPageRequest
    } = this.props;
    const {
      layout
    } = entity;
    const hasMultiEntities = Array.isArray(multiEntities) && multiEntities.length > 0;
    const hasLcmsEntity = hasMultiEntities && multiEntities.some(multiEntity => _format.default.isLCMsLayout(multiEntity?.layout));
    const isDetectedLcmsGroup = hasLcmsEntity && (0, _extractEntityLCMS.isLcMsGroup)(multiEntities);
    // For multi mode, trust multiEntities over single entity to avoid mixed-layout misrouting.
    const isLcms = hasMultiEntities ? isDetectedLcmsGroup : _format.default.isLCMsLayout(layout);
    const target = isLcms ? null : entity.spectra && Array.isArray(entity.spectra) && entity.spectra[0] || null;
    const xxLabel = !xLabel && xLabel === '' && target && target.xUnit ? `X (${target.xUnit})` : xLabel;
    const yyLabel = !yLabel && yLabel === '' && target && target.yUnit ? `Y (${target.yUnit})` : yLabel;
    const isMultiSpectra = Array.isArray(multiEntities) && multiEntities.length > 1;
    if (isLcms) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_hplc_viewer.default, {
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        molSvg: molSvg,
        forecast: forecast,
        operations: operations,
        descriptions: descriptions,
        canChangeDescription: canChangeDescription,
        onDescriptionChanged: onDescriptionChanged,
        editorOnly: editorOnly,
        onLcmsPageRequest: onLcmsPageRequest
      });
    }
    if (isMultiSpectra) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_multi_jcamps_viewer.default, {
        multiEntities: multiEntities,
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        molSvg: molSvg,
        exactMass: exactMass,
        forecast: forecast,
        editorOnly: editorOnly,
        operations: operations,
        descriptions: descriptions,
        canChangeDescription: canChangeDescription,
        onDescriptionChanged: onDescriptionChanged
      });
    } else if (_format.default.isCyclicVoltaLayout(layout)) {
      // eslint-disable-line
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_multi_jcamps_viewer.default, {
        multiEntities: [entity],
        entityFileNames: entityFileNames,
        userManualLink: userManualLink,
        molSvg: molSvg,
        exactMass: exactMass,
        forecast: forecast,
        editorOnly: editorOnly,
        operations: operations,
        descriptions: descriptions,
        canChangeDescription: canChangeDescription,
        onDescriptionChanged: onDescriptionChanged
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_layer_prism.default, {
      entity: entity,
      cLabel: cLabel,
      xLabel: xxLabel,
      yLabel: yyLabel,
      forecast: forecast,
      operations: operations,
      descriptions: descriptions,
      molSvg: molSvg,
      editorOnly: editorOnly,
      exactMass: exactMass,
      entityFileNames: entityFileNames,
      userManualLink: userManualLink,
      canChangeDescription: canChangeDescription,
      onDescriptionChanged: onDescriptionChanged
    });
  }
}
const mapStateToProps = (state, props) => (
// eslint-disable-line
{
  layoutSt: state.layout
});
const mapDispatchToProps = dispatch => (0, _redux.bindActionCreators)({
  resetInitCommonAct: _manager.resetInitCommon,
  resetInitNmrAct: _manager.resetInitNmr,
  resetInitMsAct: _manager.resetInitMs,
  resetInitCommonWithIntergationAct: _manager.resetInitCommonWithIntergation,
  resetDetectorAct: _manager.resetDetector,
  resetMultiplicityAct: _manager.resetMultiplicity,
  updateOperationAct: _submit.updateOperation,
  updateLayoutAct: _layout.updateLayout,
  updateMetaPeaksAct: _meta.updateMetaPeaks,
  addOthersAct: _jcamp.addOthers,
  setAllCurvesAct: _curve.setAllCurves,
  updateDSCMetaDataAct: _meta.updateDSCMetaData,
  clearHplcMsStateAct: _hplc_ms.clearHplcMsState
}, dispatch);
LayerInit.propTypes = {
  entity: _propTypes.default.object.isRequired,
  layoutSt: _propTypes.default.string.isRequired,
  multiEntities: _propTypes.default.array,
  // eslint-disable-line
  entityFileNames: _propTypes.default.array,
  // eslint-disable-line
  others: _propTypes.default.object.isRequired,
  cLabel: _propTypes.default.string.isRequired,
  xLabel: _propTypes.default.string.isRequired,
  yLabel: _propTypes.default.string.isRequired,
  molSvg: _propTypes.default.string.isRequired,
  editorOnly: _propTypes.default.bool.isRequired,
  exactMass: _propTypes.default.string.isRequired,
  forecast: _propTypes.default.object.isRequired,
  operations: _propTypes.default.array.isRequired,
  descriptions: _propTypes.default.array.isRequired,
  resetInitCommonAct: _propTypes.default.func.isRequired,
  resetInitNmrAct: _propTypes.default.func.isRequired,
  resetInitMsAct: _propTypes.default.func.isRequired,
  resetInitCommonWithIntergationAct: _propTypes.default.func.isRequired,
  updateOperationAct: _propTypes.default.func.isRequired,
  updateLayoutAct: _propTypes.default.func.isRequired,
  updateMetaPeaksAct: _propTypes.default.func.isRequired,
  addOthersAct: _propTypes.default.func.isRequired,
  canChangeDescription: _propTypes.default.bool.isRequired,
  onDescriptionChanged: _propTypes.default.func,
  // eslint-disable-line
  onLcmsPageRequest: _propTypes.default.func,
  setAllCurvesAct: _propTypes.default.func.isRequired,
  userManualLink: _propTypes.default.object,
  // eslint-disable-line
  resetDetectorAct: _propTypes.default.func.isRequired,
  resetMultiplicityAct: _propTypes.default.func.isRequired,
  updateDSCMetaDataAct: _propTypes.default.func.isRequired,
  clearHplcMsStateAct: _propTypes.default.func.isRequired
};
LayerInit.defaultProps = {
  onLcmsPageRequest: null
};
var _default = exports.default = (0, _reactRedux.connect)(
// eslint-disable-line
mapStateToProps, mapDispatchToProps)((0, _styles.withStyles)(styles)(LayerInit)); // eslint-disable-line