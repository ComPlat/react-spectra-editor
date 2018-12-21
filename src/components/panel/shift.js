import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import ShiftSelect from './shift_select';

const Styles = () => ({
  panelSummary: {
    backgroundColor: '#e0e0e0',
  },
});

const title = classes => (
  <ExpansionPanelSummary
    expandIcon={<ExpandMoreIcon />}
    className={classNames(classes.panelSummary)}
  >
    <Typography className="txt-panel-header">
      Shift Compensation
    </Typography>
  </ExpansionPanelSummary>
);

const ShiftPanel = ({ classes, shiftEnableSt }) => (
  shiftEnableSt
    ? (
      <ExpansionPanel>
        { title(classes) }
        <Divider />
        <ShiftSelect />
        <Divider />
      </ExpansionPanel>
    )
    : null
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    shiftEnableSt: state.shift.enable,
  }
);

ShiftPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  shiftEnableSt: PropTypes.bool.isRequired,
};

export default compose(
  connect(mapStateToProps),
  withStyles(Styles),
)(ShiftPanel);
