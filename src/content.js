import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ViewerLine from './components/viewer_line';
import ViewerRect from './components/viewer_rect';
import PredictViewer from './components/predict_viewer';
import Format from './helpers/format';

const extractLayout = (predictObj, layoutSt) => {
  const isEmpty = Object.keys(predictObj).length === 0
    && predictObj.constructor === Object;
  const isNmr = Format.isNmrLayout(layoutSt);
  const isMs = Format.isMsLayout(layoutSt);
  const isIr = false; // Format.isIrLayout(layoutSt);
  const showPredict = !isEmpty && (isNmr || isIr);
  return {
    showPredict, isNmr, isIr, isMs,
  };
};

const Content = ({
  input, cLabel, xLabel, yLabel, peakObj, predictObj, layoutSt,
}) => {
  const {
    showPredict, isNmr, isIr,
  } = extractLayout(predictObj, layoutSt);

  if (showPredict) {
    return (
      <PredictViewer
        input={input}
        cLabel={cLabel}
        xLabel={xLabel}
        yLabel={yLabel}
        peakObj={peakObj}
        predictObj={predictObj}
        isNmr={isNmr}
        isIr={isIr}
      />
    );
  }

  if (Format.isMs(peakObj)) {
    return (
      <ViewerRect
        input={input}
        cLabel={cLabel}
        xLabel={xLabel}
        yLabel={yLabel}
        peakObj={peakObj}
        isHidden={false}
      />
    );
  }

  return (
    <ViewerLine
      input={input}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
      peakObj={peakObj}
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
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
  predictObj: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Content);
