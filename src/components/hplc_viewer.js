/* eslint-disable react/default-props-match-prop-types,
react/require-default-props, react/no-unused-prop-types, react/jsx-boolean-value,
prefer-object-spread */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { withStyles } from '@mui/styles';
import {
  Grid,
} from '@mui/material';

import PanelViewer from './panel/index';
import CmdBar from './cmd_bar/index';
import ViewerLineRect from './d3_line_rect/index';

import { setAllCurves } from '../actions/curve';

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
      classes, curveSt, operations, entityFileNames,
      entities, userManualLink, molSvg, theoryMass, integrationSt,
    } = this.props;
    if (!entities || entities.length === 0) return (<div />);
    const { curveIdx } = curveSt;
    const entity = entities[curveIdx];
    const { feature, topic } = entity;
    const ticEntities = entities.slice(0, 2);
    const dataEntities = entities.slice(2);
    const { integrations } = integrationSt;
    const currentIntegration = integrations[curveIdx];

    return (
      <div className={classes.root}>
        <CmdBar
          feature={feature}
          operations={operations}
          editorOnly={true}
          hideThreshold={true}
          hideMainEditTools={true}
        />
        <div className="react-spectrum-editor">
          <Grid container>
            <Grid item xs={9}>
              <ViewerLineRect
                entities={ticEntities}
                subEntities={dataEntities}
                topic={topic}
                xLabel={feature.xUnit}
                yLabel={feature.yUnit}
                feature={feature}
                jcampIdx={curveIdx}
              />
            </Grid>
            <Grid item xs={3} align="center">
              <PanelViewer
                entities={entities}
                jcampIdx={curveIdx}
                entityFileNames={entityFileNames}
                userManualLink={userManualLink}
                feature={feature}
                molSvg={molSvg}
                theoryMass={theoryMass}
                descriptions=""
                integration={currentIntegration}
                canChangeDescription={() => {}}
                onDescriptionChanged={() => {}}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    curveSt: state.curve,
    entities: state.curve.listCurves,
    layoutSt: state.layout,
    integrationSt: state.integration.present,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setAllCurvesAct: setAllCurves,
  }, dispatch)
);

HPLCViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  entityFileNames: PropTypes.array.isRequired,
  molSvg: PropTypes.string.isRequired,
  setAllCurvesAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
  operations: PropTypes.func.isRequired,
  userManualLink: PropTypes.object,
  entities: PropTypes.array,
  layoutSt: PropTypes.string.isRequired,
  theoryMass: PropTypes.string,
  integrationSt: PropTypes.object.isRequired,
};

HPLCViewer.defaultProps = {
  entityFileNames: [],
  molSvg: '',
  cLabel: '',
  xLabel: '',
  yLabel: '',
  entities: [],
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(HPLCViewer);
