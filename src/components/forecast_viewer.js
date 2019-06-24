import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ViewerLine from './viewer_line';
import NmrViewer from './forecast/nmr_viewer';
import IrViewer from './forecast/ir_viewer';
import { TabLabel } from './common/comps';
import { setPanelIdx } from '../actions/ui';
import { initForecastStatus } from '../actions/forecast';

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

class ForecastViewer extends React.Component {
  constructor(props) {
    super(props);

    this.initForecastReducer = this.initForecastReducer.bind(this);
  }

  componentDidMount() {
    this.initForecastReducer();
  }

  componentDidUpdate(prevProps) {
    const { forecast } = this.props;

    const prevForecast = forecast;
    const nextForecast = prevProps.forecast;
    if (prevForecast !== nextForecast) {
      this.initForecastReducer();
    }
  }

  initForecastReducer() {
    const { forecast, initForecastStatusAct } = this.props;
    initForecastStatusAct(forecast);
  }

  render() {
    const {
      classes, topic, feature, cLabel, xLabel, yLabel, forecast,
      isNmr, isIr, operations, uiSt, setPanelIdxAct,
    } = this.props;
    const { panelIdx } = uiSt.viewer;
    const {
      inputCb, molecule,
    } = forecast;

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
    initForecastStatusAct: initForecastStatus,
  }, dispatch)
);

ForecastViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  topic: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  forecast: PropTypes.object.isRequired,
  isNmr: PropTypes.bool.isRequired,
  isIr: PropTypes.bool.isRequired,
  operations: PropTypes.array.isRequired,
  uiSt: PropTypes.object.isRequired,
  setPanelIdxAct: PropTypes.func.isRequired,
  initForecastStatusAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ForecastViewer);
