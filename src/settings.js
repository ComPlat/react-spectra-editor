import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';

import { Styles, SettingsComp } from './settings_component';
import { updateThreshold } from './actions/threshold';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: 0,
      enThresInput: false,
    };

    this.onItemChange = this.onItemChange.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.updateThresAsNewRef = this.updateThresAsNewRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    this.updateThresAsNewRef(prevProps);
  }

  onItemChange(e, item) {
    this.setState({ item });
  }

  onRefreshClick() {
    const { peakObj, updateThresholdAct } = this.props;
    const value = peakObj.thresRef || false;
    updateThresholdAct(value);
  }

  updateThresAsNewRef(prevProps) {
    const { peakObj, updateThresholdAct } = this.props;
    const oldValue = prevProps.peakObj.thresRef || false;
    const newValue = peakObj.thresRef || false;
    if (oldValue !== newValue) {
      this.setState({ enThresInput: Boolean(newValue) });
      updateThresholdAct(newValue);
    }
  }

  render() {
    const { classes, thresSt, updateThresholdAct } = this.props;
    const { item, enThresInput } = this.state;

    return (
      <SettingsComp
        classes={classes}
        item={item}
        thresSt={thresSt}
        enThresInput={enThresInput}
        onItemChange={this.onItemChange}
        onRefreshClick={this.onRefreshClick}
        updateThresholdAct={updateThresholdAct}
      />
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    thresSt: state.threshold,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateThresholdAct: updateThreshold,
  }, dispatch)
);

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  updateThresholdAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(Settings));
