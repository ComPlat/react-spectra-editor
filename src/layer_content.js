import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ViewerLine from './components/viewer_line';
import ViewerRect from './components/viewer_rect';
import PredictViewer from './components/predict_viewer';
import Format from './helpers/format';

const extractLayout = (forecast, layoutSt) => {
  const isEmpty = Object.keys(forecast).length === 0
    && forecast.constructor === Object;
  const isNmr = Format.isNmrLayout(layoutSt);
  const isMs = Format.isMsLayout(layoutSt);
  const isIr = Format.isIrLayout(layoutSt);
  const showPredict = !isEmpty && (isNmr || isIr);
  return {
    showPredict, isNmr, isIr, isMs,
  };
};

const Content = ({
  topic, feature, cLabel, xLabel, yLabel, forecast, operations, layoutSt,
}) => {
  const {
    showPredict, isNmr, isIr,
  } = extractLayout(forecast, layoutSt);

  if (showPredict) {
    return (
      <PredictViewer
        topic={topic}
        cLabel={cLabel}
        xLabel={xLabel}
        yLabel={yLabel}
        feature={feature}
        forecast={forecast}
        isNmr={isNmr}
        isIr={isIr}
        operations={operations}
      />
    );
  }

  if (Format.isMs(feature)) {
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
