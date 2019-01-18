import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';

import { enableAllBtn } from '../../actions/status';
import BtnSavePeaks from './btn_save';
import BtnWritePeaks from './btn_write';
import SwitchSequence from './switch_sequence';

class SubmitPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAscend: true,
    };

    this.onToggleSwitch = this.onToggleSwitch.bind(this);
  }

  onToggleSwitch() {
    const { isAscend } = this.state;
    const { enableAllBtnAct } = this.props;
    enableAllBtnAct();
    this.setState({ isAscend: !isAscend });
  }

  render() {
    const {
      savePeaks, writePeaks, peakObj,
    } = this.props;
    const { isAscend } = this.state;

    if (!savePeaks && !writePeaks) return null;

    return (
      <ExpansionPanelDetails>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <SwitchSequence
              isAscend={isAscend}
              onToggleSwitch={this.onToggleSwitch}
            />
          </Grid>
          <Grid item xs={6}>
            <BtnWritePeaks
              isAscend={isAscend}
              peakObj={peakObj}
              writePeaks={writePeaks}
            />
          </Grid>
          <Grid item xs={6}>
            <BtnSavePeaks
              isAscend={isAscend}
              peakObj={peakObj}
              savePeaks={savePeaks}
            />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    enableAllBtnAct: enableAllBtn,
  }, dispatch)
);

SubmitPanel.propTypes = {
  peakObj: PropTypes.object.isRequired,
  savePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  enableAllBtnAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SubmitPanel);
