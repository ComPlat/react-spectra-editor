/* eslint-disable react/default-props-match-prop-types,
react/require-default-props, react/no-unused-prop-types, react/jsx-boolean-value,
prefer-object-spread */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import PanelViewer from './panel/index';
import CmdBar from './cmd_bar/index';
import ViewerMulti from './d3_multi/index';

import { setAllCurves } from '../actions/curve';
import {
  addNewCylicVoltaPairPeak, addCylicVoltaMaxPeak, addCylicVoltaMinPeak, addCylicVoltaPecker,
} from '../actions/cyclic_voltammetry';

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

const seperatingSubLayout = (entities, featureCondition) => {
  const storedDict = {};
  entities.forEach((entity) => {
    const { feature } = entity;
    const keyValue = feature[featureCondition];
    if (keyValue in storedDict) {
      storedDict[keyValue].push(entity);
    } else {
      storedDict[keyValue] = [entity];
    }
  });
  return Object.assign({}, storedDict);
};

class MultiJcampsViewer extends React.Component { // eslint-disable-line
  render() {
    const {
      classes, curveSt, operations, entityFileNames, entities, userManualLink, molSvg,
    } = this.props;
    if (!entities || entities.length === 0) return (<div />);

    const seperatedSubLayouts = seperatingSubLayout(entities, 'xUnit');
    const { curveIdx } = curveSt;
    const entity = entities[curveIdx];
    const { feature, topic } = entity;

    return (
      <div className={classes.root}>
        <CmdBar
          feature={feature}
          operations={operations}
          editorOnly={true}
          hideThreshold={true}
        />
        <div className="react-spectrum-editor">
          <Grid container>
            <Grid item xs={9}>
              <ViewerMulti
                entities={entities}
                topic={topic}
                xLabel={feature.xUnit}
                yLabel={feature.yUnit}
                feature={feature}
              />
            </Grid>
            <Grid item xs={3} align="center">
              <PanelViewer
                jcampIdx={curveIdx}
                entityFileNames={entityFileNames}
                userManualLink={userManualLink}
                feature={feature}
                molSvg={molSvg}
                subLayoutsInfo={seperatedSubLayouts}
                descriptions=""
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
    cyclicVoltaSt: state.cyclicvolta,
    entities: state.curve.listCurves,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setAllCurvesAct: setAllCurves,
    addNewCylicVoltaPairPeakAct: addNewCylicVoltaPairPeak,
    addCylicVoltaMaxPeakAct: addCylicVoltaMaxPeak,
    addCylicVoltaMinPeakAct: addCylicVoltaMinPeak,
    addCylicVoltaPeckerAct: addCylicVoltaPecker,
  }, dispatch)
);

MultiJcampsViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  multiEntities: PropTypes.array.isRequired,
  entityFileNames: PropTypes.array.isRequired,
  molSvg: PropTypes.string.isRequired,
  setAllCurvesAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
  cyclicVoltaSt: PropTypes.object.isRequired,
  addNewCylicVoltaPairPeakAct: PropTypes.func.isRequired,
  addCylicVoltaMaxPeakAct: PropTypes.func.isRequired,
  addCylicVoltaMinPeakAct: PropTypes.func.isRequired,
  operations: PropTypes.func.isRequired,
  userManualLink: PropTypes.object,
  entities: PropTypes.array,
};

MultiJcampsViewer.defaultProps = {
  multiEntities: [],
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
)(MultiJcampsViewer);
