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
import { initPredictStatus } from '../actions/predict';

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

class PredictViewer extends React.Component {
  constructor(props) {
    super(props);

    this.initPredictReducer = this.initPredictReducer.bind(this);
  }

  componentDidMount() {
    this.initPredictReducer();
  }

  componentDidUpdate(prevProps) {
    const { predictObj, uiSt } = this.props;
    const { panelIdx } = uiSt.viewer;

    const prevPredictions = predictObj.predictions;
    const nextPredictions = prevProps.predictObj.predictions;
    if (prevPredictions !== nextPredictions) {
      this.initPredictReducer();
    }
  }

  initPredictReducer() {
    const { predictObj, initPredictStatusAct } = this.props;
    const { predictions } = predictObj;
    initPredictStatusAct(predictions);
  }

  render() {
    const {
      classes, topic, feature, cLabel, xLabel, yLabel, predictObj,
      isNmr, isIr, operations, uiSt, setPanelIdxAct,
    } = this.props;
    const { panelIdx } = uiSt.viewer;
    const {
      inputCb, molecule,
    } = predictObj;

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
              molecule={molecule}
              operations={operations}
              inputCb={inputCb}
            />
          )
        }
        {
          panelIdx === 1 && isIr && (
            <IrViewer
              feature={feature}
              molecule={molecule}
              operations={operations}
              inputCb={inputCb}
            />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    uiSt: state.ui,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setPanelIdxAct: setPanelIdx,
    initPredictStatusAct: initPredictStatus,
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
  operations: PropTypes.array.isRequired,
  uiSt: PropTypes.object.isRequired,
  setPanelIdxAct: PropTypes.func.isRequired,
  initPredictStatusAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(PredictViewer);
