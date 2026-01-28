/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@mui/styles';

import ViewerLine from './d3_line/index';
import NmrViewer from './forecast/nmr_viewer';
import IrViewer from './forecast/ir_viewer';
import { initForecastStatus } from '../actions/forecast';
import { setUiViewerType } from '../actions/ui';
import { LIST_UI_VIEWER_TYPE } from '../constants/list_ui';

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
    const {
      forecast, initForecastStatusAct, setUiViewerTypeAct,
    } = this.props;
    const predictionCurveIdx = (
      forecast
      && forecast.predictions
      && Number.isInteger(forecast.predictions.curveIdx)
    ) ? forecast.predictions.curveIdx : null;
    const payload = predictionCurveIdx === null
      ? forecast
      : { ...forecast, curveIdx: predictionCurveIdx };
    initForecastStatusAct(payload);
    if (forecast && forecast.predictions) {
      const { running, refreshed } = forecast.predictions;
      if (running || refreshed) setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.ANALYSIS);
    }
  }

  render() {
    const {
      classes, topic, feature, cLabel, xLabel, yLabel, forecast,
      isNmr, isIr, uiSt, isXRD, wavelength, curveSt,
      jcampSt,
    } = this.props;
    const { viewer } = uiSt;
    const {
      inputCb, molecule,
    } = forecast;

    const { curveIdx } = curveSt;
    const { jcamps } = jcampSt;
    const currentJcamp = jcamps && jcamps[curveIdx];
    const comparisons = currentJcamp && currentJcamp.others ? currentJcamp.others : [];

    return (
      <div className={classes.root}>
        <ViewerLine
          topic={topic}
          feature={feature}
          cLabel={cLabel}
          xLabel={(isXRD && wavelength) ? (`${xLabel}, WL=${wavelength.value} ${wavelength.unit}`) : xLabel}
          yLabel={yLabel}
          comparisons={comparisons}
          isHidden={viewer !== LIST_UI_VIEWER_TYPE.SPECTRUM}
        />
        {
          (viewer === LIST_UI_VIEWER_TYPE.ANALYSIS) && isNmr && (
            <NmrViewer
              molecule={molecule}
              inputCb={inputCb}
            />
          )
        }
        {
          (viewer === LIST_UI_VIEWER_TYPE.ANALYSIS) && isIr && (
            <IrViewer
              molecule={molecule}
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
    jcampSt: state.jcamp,
    wavelength: state.wavelength,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    initForecastStatusAct: initForecastStatus,
    setUiViewerTypeAct: setUiViewerType,
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
  isUvvis: PropTypes.bool.isRequired,
  isXRD: PropTypes.bool.isRequired,
  uiSt: PropTypes.object.isRequired,
  jcampSt: PropTypes.object.isRequired,
  initForecastStatusAct: PropTypes.func.isRequired,
  setUiViewerTypeAct: PropTypes.func.isRequired,
  wavelength: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ForecastViewer);
