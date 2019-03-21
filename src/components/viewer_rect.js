import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import {
  Topic2Seed, Feature2Peak, ToThresEndPts, ToShiftPeaks,
} from '../helpers/chem';
import { updateBorder } from '../actions/border';
import { resetAll } from '../actions/manager';
import { clickPoint } from '../actions/edit_peak';
import RectMain from './d3_rect/rect_main';

class ViewerRect extends React.Component {
  constructor(props) {
    super(props);

    const { clickPointAct } = props;
    this.main = new RectMain({ clickPointAct });
    this.d3Ref = React.createRef();

    this.normChange = this.normChange.bind(this);
  }

  componentDidMount() {
    const {
      seed, peak, cLabel, xLabel, yLabel, feature,
      borderSt, tTrEndPts, tSfPeaks, editPeakSt, editModeSt,
      updateBorderAct, resetAllAct,
    } = this.props;

    resetAllAct(feature);

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.chart = this.main.create(
      node,
      seed,
      peak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      editModeSt,
      filterSeed,
      filterPeak,
      cLabel,
      xLabel,
      yLabel,
      updateBorderAct,
    );
  }

  componentDidUpdate(prevProps) {
    const {
      seed, peak, cLabel, xLabel, yLabel, borderSt, tTrEndPts, tSfPeaks,
      editPeakSt, editModeSt, isHidden,
    } = this.props;

    this.normChange(prevProps);

    const { filterSeed, filterPeak } = this.brushFilter(borderSt, seed, peak);
    const node = this.d3Ref.current;
    this.main.update(
      node,
      seed,
      peak,
      tTrEndPts,
      tSfPeaks,
      editPeakSt,
      editModeSt,
      filterSeed,
      filterPeak,
      cLabel,
      xLabel,
      yLabel,
      isHidden,
    );
  }

  componentWillUnmount() {
    const node = this.d3Ref.current;
    this.main.destroy(node);
  }

  normChange(prevProps) {
    const { feature, resetAllAct } = this.props;
    const oldFeature = prevProps.feature;
    if (oldFeature !== feature) {
      resetAllAct(feature);
    }
  }

  brushFilter(border, seed, peak) {
    if (border.length === 0) {
      return { filterSeed: seed, filterPeak: peak };
    }
    const [one, two] = border;
    const xL = one < two ? one : two;
    const xU = one > two ? one : two;
    let fltSeed = [...seed];
    if (xL && xU) {
      fltSeed = fltSeed.filter(
        d => xL <= d.x && d.x <= xU,
      );
    }
    let fltPeak = [...peak];
    if (peak && xL && xU) {
      fltPeak = fltPeak.filter(
        d => xL <= d.x && d.x <= xU,
      );
    }
    return { filterSeed: fltSeed, filterPeak: fltPeak };
  }

  render() {
    return (
      <div
        className="d3-container"
        ref={this.d3Ref}
      />
    );
  }
}

const mapStateToProps = (state, props) => (
  {
    borderSt: state.border,
    seed: Topic2Seed(state, props),
    peak: Feature2Peak(state, props),
    tTrEndPts: ToThresEndPts(state, props),
    tSfPeaks: ToShiftPeaks(state, props),
    editPeakSt: state.editPeak,
    editModeSt: state.mode.edit,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateBorderAct: updateBorder,
    resetAllAct: resetAll,
    clickPointAct: clickPoint,
  }, dispatch)
);

ViewerRect.propTypes = {
  seed: PropTypes.array.isRequired,
  peak: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  feature: PropTypes.object.isRequired,
  borderSt: PropTypes.array.isRequired,
  tTrEndPts: PropTypes.array.isRequired,
  tSfPeaks: PropTypes.array.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  editModeSt: PropTypes.string.isRequired,
  updateBorderAct: PropTypes.func.isRequired,
  resetAllAct: PropTypes.func.isRequired,
  clickPointAct: PropTypes.func.isRequired,
  isHidden: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewerRect);