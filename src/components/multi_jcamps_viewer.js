/* eslint-disable react/default-props-match-prop-types,
react/require-default-props, react/no-unused-prop-types, react/jsx-boolean-value,
prefer-object-spread */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Grid from '@mui/material/Grid';
import { withStyles } from '@mui/styles';

import PanelViewer from './panel/index';
import CyclicVoltammetryPanel from './panel/cyclic_voltamery_data';
import CmdBar from './cmd_bar/index';
import ViewerMulti from './d3_multi/index';

import { setAllCurves } from '../actions/curve';
import {
  addNewCylicVoltaPairPeak, addCylicVoltaMaxPeak, addCylicVoltaMinPeak, addCylicVoltaPecker,
} from '../actions/cyclic_voltammetry';
import { LIST_LAYOUT } from '../constants/list_layout';
import Format from '../helpers/format';

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
  cvEditor: {
    height: 'calc(90vh - 220px)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  },
  cvTopRow: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'hidden',
  },
  cvViewerCol: {
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  cvViewerWrap: {
    flex: '1 1 auto',
    minHeight: 0,
  },
  cvPanelBelow: {
    marginTop: 16,
    width: '100%',
  },
});

const seperatingSubLayout = (entities, featureCondition, layoutSt) => {
  if (layoutSt === LIST_LAYOUT.CYCLIC_VOLTAMMETRY) {
    return null;
  }
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
      classes, curveSt, operations, entityFileNames,
      entities, userManualLink, molSvg, exactMass, layoutSt,
      integrationSt, descriptions, canChangeDescription, onDescriptionChanged,
      forecast, editorOnly,
    } = this.props;
    if (!entities || entities.length === 0) return (<div />);

    const separateCondition = Format.isGCLayout(layoutSt) ? 'yUnit' : 'xUnit';
    const seperatedSubLayouts = seperatingSubLayout(entities, separateCondition, layoutSt);
    const { curveIdx } = curveSt;
    const entity = entities[curveIdx];
    const { feature, topic } = entity;
    const { integrations } = integrationSt;
    const currentIntegration = integrations[curveIdx];
    const hasEdit = !!feature?.data?.[0]?.x?.length;
    const xLabel = feature?.xUnit || '';
    const yLabel = feature?.yUnit || '';

    const isCyclicVolta = Format.isCyclicVoltaLayout(layoutSt);

    return (
      <div className={classes.root}>
        <CmdBar
          feature={feature}
          hasEdit={hasEdit}
          forecast={forecast || {}}
          operations={operations}
          editorOnly={editorOnly}
          hideThreshold={!Format.isNmrLayout(layoutSt)}
        />
        <div className={classNames('react-spectrum-editor', isCyclicVolta && classes.cvEditor)}>
          <Grid container className={isCyclicVolta ? classes.cvTopRow : undefined}>
            <Grid item xs={9} className={isCyclicVolta ? classes.cvViewerCol : undefined}>
              <div className={isCyclicVolta ? classes.cvViewerWrap : undefined}>
                <ViewerMulti
                  entities={entities}
                  topic={topic}
                  xLabel={xLabel}
                  yLabel={yLabel}
                  feature={feature}
                />
              </div>
              {isCyclicVolta ? (
                <div className={classes.cvPanelBelow}>
                  <CyclicVoltammetryPanel
                    jcampIdx={curveIdx}
                    feature={feature}
                    userManualLink={userManualLink ? userManualLink.cv : undefined}
                  />
                </div>
              ) : null}
            </Grid>
            <Grid item xs={3} align="center">
              <PanelViewer
                jcampIdx={curveIdx}
                entityFileNames={entityFileNames}
                userManualLink={userManualLink}
                feature={feature}
                molSvg={molSvg}
                exactMass={exactMass}
                subLayoutsInfo={seperatedSubLayouts}
                integration={currentIntegration}
                descriptions={descriptions}
                editorOnly={editorOnly}
                canChangeDescription={canChangeDescription}
                onDescriptionChanged={onDescriptionChanged}
                hideCyclicVolta={isCyclicVolta}
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
    layoutSt: state.layout,
    integrationSt: state.integration.present,
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
  operations: PropTypes.array.isRequired,
  forecast: PropTypes.object,
  editorOnly: PropTypes.bool,
  userManualLink: PropTypes.object,
  entities: PropTypes.array,
  layoutSt: PropTypes.string.isRequired,
  exactMass: PropTypes.string,
  integrationSt: PropTypes.object.isRequired,
  descriptions: PropTypes.array.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func,
};

MultiJcampsViewer.defaultProps = {
  multiEntities: [],
  entityFileNames: [],
  molSvg: '',
  cLabel: '',
  xLabel: '',
  yLabel: '',
  entities: [],
  forecast: {},
  editorOnly: false,
  descriptions: [],
  canChangeDescription: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(MultiJcampsViewer);
