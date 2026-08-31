/* eslint-disable prefer-object-spread, default-param-last,
react/function-component-definition, react/require-default-props
*/
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@mui/material/Grid';
import { withStyles } from '@mui/styles';

import PanelViewer from './components/panel/index';
import CmdBar from './components/cmd_bar/index';
import LayerContent from './layer_content';
import { LIST_UI_VIEWER_TYPE } from './constants/list_ui';
import { extractParams } from './helpers/extractParams';
import { LIST_HOST_HOOK_CLASS } from './constants/list_graph';

const styles = () => ({
});

const getThresholdState = (state) => {
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
const dataBlockDigest = (data0) => {
  if (!data0) return 'none';
  const xs = Array.isArray(data0.x) ? data0.x : [];
  const ys = Array.isArray(data0.y) ? data0.y : [];
  return `${xs.length}:${xs[0]}:${xs[xs.length - 1]}:${ys.length}:${ys[0]}:${ys[ys.length - 1]}`;
};

const entitySignature = (e) => {
  if (!e) return 'none';
  const id = e.idDt ?? e.id ?? e.datasetId;
  const spectraDigest = Array.isArray(e.spectra)
    ? e.spectra.map((s) => dataBlockDigest(s?.data?.[0])).join(';')
    : 'none';
  const features = (e.features && typeof e.features === 'object' && !Array.isArray(e.features))
    ? e.features
    : {};
  const autoDigest = dataBlockDigest(features.autoPeak?.data?.[0]);
  const editDigest = dataBlockDigest(features.editPeak?.data?.[0]);
  return `${e.layout || ''}|${e.title || ''}|id:${id ?? ''}|sp:${spectraDigest}|auto:${autoDigest}|edit:${editDigest}`;
};

const useExtractedParams = (entity, thresSt, scanSt) => {
  const signature = `${entitySignature(entity)}|${JSON.stringify(thresSt)}|${JSON.stringify(scanSt)}`;
  const cacheRef = useRef(null);
  if (!cacheRef.current || cacheRef.current.signature !== signature) {
    cacheRef.current = { signature, result: extractParams(entity, thresSt, scanSt) };
  }
  return cacheRef.current.result;
};

const LayerPrism = ({
  entity, cLabel, xLabel, yLabel, forecast, operations,
  descriptions, molSvg, editorOnly, exactMass,
  thresSt, scanSt, uiSt, curveSt, integrationSt,
  canChangeDescription, onDescriptionChanged, entityFileNames, userManualLink,
}) => {
  const {
    topic, feature, hasEdit, integration: initialIntegration, features,
  } = useExtractedParams(entity, thresSt, scanSt);
  if (!topic) return null;

  const curveIdx = (curveSt && Number.isFinite(curveSt.curveIdx)) ? curveSt.curveIdx : 0;
  const liveIntegrations = (integrationSt && Array.isArray(integrationSt.integrations))
    ? integrationSt.integrations
    : null;
  const liveIntegration = liveIntegrations ? liveIntegrations[curveIdx] : null;
  const integration = liveIntegration || initialIntegration;

  const { viewer } = uiSt;
  if (viewer === LIST_UI_VIEWER_TYPE.ANALYSIS) {
    return (
      <div>
        <CmdBar
          feature={feature}
          hasEdit={hasEdit}
          forecast={forecast}
          operations={operations}
          editorOnly={editorOnly}
        />
        <div className={LIST_HOST_HOOK_CLASS.EDITOR_ROOT}>
          <Grid container>
            <Grid item xs={12}>
              <LayerContent
                topic={topic}
                feature={feature}
                features={features || []}
                cLabel={cLabel}
                xLabel={xLabel}
                yLabel={yLabel}
                forecast={forecast}
                operations={operations}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CmdBar
        feature={feature}
        hasEdit={hasEdit}
        forecast={forecast}
        operations={operations}
        editorOnly={editorOnly}
      />
      <div className={LIST_HOST_HOOK_CLASS.EDITOR_ROOT}>
        <Grid container>
          <Grid item xs={9}>
            <LayerContent
              topic={topic}
              feature={feature}
              features={features || []}
              cLabel={cLabel}
              xLabel={xLabel}
              yLabel={yLabel}
              forecast={forecast}
              operations={operations}
            />
          </Grid>
          <Grid item xs={3} align="center">
            <PanelViewer
              feature={feature}
              integration={integration}
              editorOnly={editorOnly}
              molSvg={molSvg}
              exactMass={exactMass}
              entityFileNames={entityFileNames}
              userManualLink={userManualLink}
              descriptions={descriptions}
              canChangeDescription={canChangeDescription}
              onDescriptionChanged={onDescriptionChanged}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    scanSt: state.scan,
    thresSt: getThresholdState(state),
    uiSt: state.ui,
    curveSt: state.curve,
    integrationSt: state.integration.present,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
  }, dispatch)
);

LayerPrism.propTypes = {
  entity: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  molSvg: PropTypes.string.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  exactMass: PropTypes.string,
  forecast: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  descriptions: PropTypes.array.isRequired,
  thresSt: PropTypes.object.isRequired,
  scanSt: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  integrationSt: PropTypes.object.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func,
  entityFileNames: PropTypes.array,
  userManualLink: PropTypes.object,
};

export default connect( // eslint-disable-line
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(LayerPrism));  // eslint-disable-line
