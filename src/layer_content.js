import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ViewerLine from './components/d3_line/index';
import ViewerRect from './components/d3_rect/index';
import ForecastViewer from './components/forecast_viewer';
import Format from './helpers/format';

const extractLayout = (forecast, layoutSt) => {
  const isEmpty = Object.keys(forecast).length === 0
    && forecast.constructor === Object;
  const isNmr = Format.isNmrLayout(layoutSt);
  const isMs = Format.isMsLayout(layoutSt);
  const isIr = Format.isIrLayout(layoutSt);
  const isUvvis = Format.isUvVisLayout(layoutSt) || Format.isHplcUvVisLayout(layoutSt);
  const showForecast = !isEmpty && (isNmr || isIr || isUvvis);
  const isXRD = Format.isXRDLayout(layoutSt);
  const showForecast = !isEmpty && (isNmr || isIr || isUvvis || isXRD);
  return {
    showForecast, isNmr, isIr, isMs, isUvvis, isXRD
  };
};

const Content = ({
  topic, feature, cLabel, xLabel, yLabel, forecast, operations, layoutSt,
}) => {
  const {
    showForecast, isNmr, isIr, isMs, isUvvis, isXRD
  } = extractLayout(forecast, layoutSt);

  if (showForecast) {
    return (
      <ForecastViewer
        topic={topic}
        cLabel={cLabel}
        xLabel={xLabel}
        yLabel={yLabel}
        feature={feature}
        forecast={forecast}
        isNmr={isNmr}
        isIr={isIr}
        isUvvis={isUvvis}
        isXRD={isXRD}
        operations={operations}
      />
    );
  }

  if (isMs) {
    return (
      <ViewerRect
        topic={topic}
        cLabel={cLabel}
        xLabel={xLabel}
        yLabel={yLabel}
        feature={feature}
        isHidden={false}
      />
    );
  }

  return (
    <ViewerLine
      topic={topic}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
      feature={feature}
      isHidden={false}
    />
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

Content.propTypes = {
  topic: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  forecast: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
  layoutSt: PropTypes.string.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Content);
