import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import PanelViewer from './components/panel/index';
import LayerContent from './layer_content';

const styles = () => ({
});

const extractMs = (entity, scanSt) => {
  const { target, isAuto } = scanSt;
  const defaultFeat = entity.features[0];
  const hasEdit = !!defaultFeat.scanEditTarget;
  const defaultIdx = isAuto || !hasEdit
    ? defaultFeat.scanAutoTarget
    : defaultFeat.scanEditTarget;
  const defaultCount = +defaultFeat.scanCount;
  let idx = +(target || defaultIdx || 1);
  if (idx > defaultCount) { idx = defaultCount; }
  const feature = entity.features[idx - 1];
  return (
    {
      topic: feature.data[0],
      feature,
      hasEdit,
    }
  );
};

const extractNmrIr = (entity, thresSt) => {
  const { spectrum, features } = entity;
  const [peakAll, peakEdit] = features;
  const hasEdit = peakEdit && peakEdit.data
    ? peakEdit.data[0].x.length > 0
    : false;

  const feature = hasEdit && thresSt.isEdit ? peakEdit : peakAll;
  return { topic: spectrum.data[0], feature, hasEdit };
};

const extract = (entity, thresSt, scanSt) => {
  const defaultFeat = entity.features[0];
  const layout = defaultFeat.dataType;
  const isMS = layout === 'MASS SPECTRUM';
  return isMS
    ? extractMs(entity, scanSt)
    : extractNmrIr(entity, thresSt);
};

const LayerPrism = ({
  entity, cLabel, xLabel, yLabel, operations, forecast,
  thresSt, scanSt, uiSt,
}) => {
  const { topic, feature, hasEdit } = extract(entity, thresSt, scanSt);
  if (!topic) return null;

  const { panelIdx } = uiSt.viewer;
  if (panelIdx === 1) {
    return (
      <div className="react-spectrum-viewer">
        <Grid container>
          <Grid item xs={12}>
            <LayerContent
              topic={topic}
              feature={feature}
              cLabel={cLabel}
              xLabel={xLabel}
              yLabel={yLabel}
              forecast={forecast}
              operations={operations}
            />
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div className="react-spectrum-viewer">
      <Grid container>
        <Grid item xs={9}>
          <LayerContent
            topic={topic}
            feature={feature}
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
            hasEdit={hasEdit}
            operations={operations}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    scanSt: state.scan,
    thresSt: state.threshold,
    uiSt: state.ui,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

LayerPrism.propTypes = {
  entity: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  forecast: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  thresSt: PropTypes.object.isRequired,
  scanSt: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(LayerPrism));
