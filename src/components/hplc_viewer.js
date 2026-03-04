/* eslint-disable react/default-props-match-prop-types,
react/require-default-props, react/no-unused-prop-types, react/jsx-boolean-value,
prefer-object-spread */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@mui/styles';
import {
  Grid,
} from '@mui/material';

import PanelViewer from './panel/index';
import CmdBar from './cmd_bar/index';
import ViewerLineRect from './d3_line_rect/index';
import { splitAndReindexEntities } from '../helpers/extractEntityLCMS';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
  tabLabel: {
    fontSize: '14px',
  },
});

class HPLCViewer extends React.Component { // eslint-disable-line
  render() {
    const {
      classes, curveState, operations, entityFileNames,
      entities, userManualLink, molSvg, theoryMass, integrationState, hplcMsState,
      descriptions, canChangeDescription, onDescriptionChanged, editorOnly, forecast,
    } = this.props;
    if (!entities || entities.length === 0) return (<div />);
    const { curveIdx } = curveState;
    const entity = entities[curveIdx];
    if (!entity) return (<div />);
    const { feature, topic } = entity || {};
    const { ticEntities, uvvisEntities, mzEntities } = splitAndReindexEntities(entities);
    const displayFeature = feature || (entities[0]?.feature) || (entities[0]?.features?.[0]) || {};
    const hasEdit = !!displayFeature?.data?.[0]?.x?.length;
    const { integrations } = integrationState;
    const currentIntegration = integrations[curveIdx];

    return (
      <div className={classes.root}>
        <CmdBar
          feature={displayFeature}
          hasEdit={hasEdit}
          forecast={forecast || {}}
          operations={operations}
          editorOnly={editorOnly}
          hideThreshold={true}
          hideMainEditTools={true}
        />
        <div className="react-spectrum-editor">
          <Grid container>
            <Grid item xs={9}>
              <ViewerLineRect
                ticEntities={ticEntities}
                uvvisEntities={uvvisEntities}
                mzEntities={mzEntities}
                topic={topic}
                xLabel={displayFeature?.xUnit || ''}
                yLabel={displayFeature?.yUnit || ''}
                feature={displayFeature}
                jcampIdx={curveIdx}
                hplcMsSt={hplcMsState}
                isHidden={false}
              />
            </Grid>
            <Grid item xs={3} align="center">
              <PanelViewer
                entities={entities}
                jcampIdx={curveIdx}
                entityFileNames={entityFileNames}
                userManualLink={userManualLink}
                feature={displayFeature}
                molSvg={molSvg}
                theoryMass={theoryMass}
                descriptions={descriptions}
                integration={currentIntegration}
                canChangeDescription={canChangeDescription}
                onDescriptionChanged={onDescriptionChanged}
                editorOnly={editorOnly}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
    curveState: state.curve,
    entities: state.curve.listCurves,
    integrationState: state.integration.present,
    hplcMsState: state.hplcMs,
  }
);

HPLCViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  entityFileNames: PropTypes.array.isRequired,
  molSvg: PropTypes.string.isRequired,
  curveState: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  forecast: PropTypes.object,
  userManualLink: PropTypes.object,
  entities: PropTypes.array,
  theoryMass: PropTypes.string,
  integrationState: PropTypes.object.isRequired,
  hplcMsState: PropTypes.object.isRequired,
  descriptions: PropTypes.array.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func,
  editorOnly: PropTypes.bool.isRequired,
};

HPLCViewer.defaultProps = {
  entityFileNames: [],
  molSvg: '',
  cLabel: '',
  xLabel: '',
  yLabel: '',
  entities: [],
  forecast: {},
  onDescriptionChanged: () => {},
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(HPLCViewer);
