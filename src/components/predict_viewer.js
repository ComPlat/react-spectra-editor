import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ViewerLine from './viewer_line';
import NmrViewer from './predict/nmr_viewer';
import IrViewer from './predict/ir_viewer';
import { TabLabel } from './common/comps';
import { setPanelIdx } from '../actions/ui';

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

const PredictViewer = ({
  classes, topic, feature, cLabel, xLabel, yLabel, predictObj,
  isNmr, isIr, uiSt, setPanelIdxAct,
}) => {
  const { panelIdx } = uiSt.viewer;

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={panelIdx}
          onChange={setPanelIdxAct}
        >
          <Tab label={TabLabel(classes, 'Spectrum', 'txt-prd-tab-label')} />
          <Tab label={TabLabel(classes, 'Analysis', 'txt-prd-tab-label')} />
        </Tabs>
      </AppBar>
      {
        <ViewerLine
          topic={topic}
          feature={feature}
          cLabel={cLabel}
          xLabel={xLabel}
          yLabel={yLabel}
          isHidden={panelIdx !== 0}
        />
      }
      {
        panelIdx === 1 && isNmr && (
          <NmrViewer
            feature={feature}
            predictObj={predictObj}
          />
        )
      }
      {
        panelIdx === 1 && isIr && (
          <IrViewer
            feature={feature}
            predictObj={predictObj}
          />
        )
      }
    </div>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    uiSt: state.ui,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setPanelIdxAct: setPanelIdx,
  }, dispatch)
);

PredictViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  predictObj: PropTypes.object.isRequired,
  isNmr: PropTypes.bool.isRequired,
  isIr: PropTypes.bool.isRequired,
  uiSt: PropTypes.object.isRequired,
  setPanelIdxAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(PredictViewer);
