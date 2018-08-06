import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { updateBorder, resetBorder } from '../actions/border';
import D3Canvas from './d3_canvas';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { width, height } = props;
    this.d3Ref = React.createRef();
    this.canvas = new D3Canvas({ W: width, H: height });

    this.seSeedChange = this.seSeedChange.bind(this);
  }

  componentDidMount() {
    const {
      seed, cLabel, xLabel, yLabel, borderSt, updateBorderAct,
    } = this.props;

    const data = this.brushFilter(borderSt, seed);
    this.chart = this.canvas.create(
      this.d3Ref.current,
      seed,
      data,
      cLabel,
      xLabel,
      yLabel,
      updateBorderAct,
    );
  }

  componentDidUpdate(prevProps) {
    const {
      seed, cLabel, xLabel, yLabel, borderSt,
    } = this.props;

    this.seSeedChange(prevProps);

    const data = this.brushFilter(borderSt, seed);
    this.canvas.update(
      this.d3Ref.current,
      seed,
      data,
      cLabel,
      xLabel,
      yLabel,
    );
  }

  componentWillUnmount() {
    this.canvas.destroy(this.d3Ref.current);
  }

  seSeedChange(prevProps) {
    const { seed, resetBorderAct } = this.props;
    const oldSeed = prevProps.seed;
    if (oldSeed !== seed) {
      resetBorderAct();
    }
  }

  brushFilter(border, inp) {
    const xL = border[0];
    const xU = border[1];
    let data = [...inp];
    if (xL && xU) {
      data = data.filter(
        d => xL <= d.x && d.x <= xU,
      );
    }
    return data;
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

const mapStateToProps = state => (
  {
    borderSt: state.border,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateBorderAct: updateBorder,
    resetBorderAct: resetBorder,
  }, dispatch)
);

App.propTypes = {
  seed: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  borderSt: PropTypes.array.isRequired,
  updateBorderAct: PropTypes.func.isRequired,
  resetBorderAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
