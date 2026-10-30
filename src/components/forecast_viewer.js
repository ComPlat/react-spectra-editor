/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import { withStyles } from '@mui/styles';

import ViewerLine from './d3_line/index';
import ViewerMulti from './d3_multi/index';
import NmrViewer from './forecast/nmr_viewer';
import IrViewer from './forecast/ir_viewer';
import { initForecastStatus } from '../actions/forecast';
import { setUiViewerType } from '../actions/ui';
import { LIST_UI_VIEWER_TYPE } from '../constants/list_ui';

// A host that rebuilds `forecast` as a fresh object literal on every render
// (no memoization on its side) must not make ForecastViewer re-dispatch
// FORECAST.INIT_STATUS on every single re-render regardless of whether the
// prediction data actually changed - only `predictions`/`molecule` drive
// initForecastReducer's effect, so compare those by content instead of the
// whole `forecast` object by reference.
const forecastSignature = (forecast) => {
  if (!forecast || typeof forecast !== 'object') return 'none';
  const { predictions, molecule } = forecast;
  try {
    return JSON.stringify({ predictions, molecule });
  } catch (e) {
    // Unstringifiable content (e.g. a circular structure): never treat as
    // equal, so we fall back to the old always-refresh behavior.
    return null;
  }
};

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
    const prevSig = forecastSignature(prevProps.forecast);
    const nextSig = forecastSignature(forecast);
    if (prevSig === null || nextSig === null || prevSig !== nextSig) {
      this.initForecastReducer();
    }
  }

  initForecastReducer() {
    const { forecast, initForecastStatusAct, setUiViewerTypeAct } = this.props;
    initForecastStatusAct(forecast);
    if (forecast && forecast.predictions) {
      const { running, refreshed } = forecast.predictions;
      if (running || refreshed) setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.ANALYSIS);
    }
  }

  render() {
    const {
      classes, topic, feature, cLabel, xLabel, yLabel, forecast,
      isNmr, isIr, uiSt, isXRD, wavelength, curveSt,
      jcampSt, entities,
    } = this.props;
    const { viewer } = uiSt;
    const {
      inputCb, molecule,
    } = forecast;

    const isHidden = viewer !== LIST_UI_VIEWER_TYPE.SPECTRUM;
    // The chart stays mounted, only hidden, while the analysis is shown: mounting it again
    // would reset the user's edits.
    let chart;
    if (entities) {
      chart = (
        <ViewerMulti
          entities={entities}
          topic={topic}
          xLabel={xLabel}
          yLabel={yLabel}
          feature={feature}
          isHidden={isHidden}
        />
      );
    } else {
      const { curveIdx } = curveSt;
      const { jcamps } = jcampSt;
      const comparisons = jcamps[curveIdx] && jcamps[curveIdx].others;
      chart = (
        <ViewerLine
          topic={topic}
          feature={feature}
          cLabel={cLabel}
          xLabel={(isXRD && wavelength) ? (`${xLabel}, WL=${wavelength.value} ${wavelength.unit}`) : xLabel}
          yLabel={yLabel}
          comparisons={comparisons}
          isHidden={isHidden}
        />
      );
    }

    return (
      <div className={classes.root}>
        { chart }
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
  // The curves of a multi-spectrum view; draws them all instead of the single spectrum.
  entities: PropTypes.array,
};

ForecastViewer.defaultProps = {
  entities: null,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ForecastViewer);
