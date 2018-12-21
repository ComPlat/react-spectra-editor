import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import { rmShiftPeak } from '../../actions/shift';

const styles = () => ({
  chipContainer: {
    margin: '10px',
  },
  txtContainer: {
    height: '40px',
  },
  chip: {
    margin: '5px',
  },
  txt: {
    margin: '20px',
  },
  icon: {
  },
});

const ShiftPeak = ({ shiftPeakSt, rmShiftPeakAct, classes }) => (
  shiftPeakSt
    ? (
      <div className={classNames(classes.chipContainer)}>
        <LocationOnIcon className={classNames(classes.icon)} />
        <Chip
          className={classNames(classes.chip, 'txt-panel-content')}
          label={shiftPeakSt.x}
          onDelete={rmShiftPeakAct}
        />
      </div>
    )
    : (
      <div className={classNames(classes.txtContainer)}>
        <Typography className={classNames(classes.txt, 'txt-panel-content')}>
          <i>No peak selected!</i>
        </Typography>
      </div>
    )
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    shiftPeakSt: state.shift.peak,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    rmShiftPeakAct: rmShiftPeak,
  }, dispatch)
);

ShiftPeak.propTypes = {
  classes: PropTypes.object.isRequired,
  shiftPeakSt: PropTypes.oneOfType(
    [
      PropTypes.object,
      PropTypes.bool,
    ],
  ).isRequired,
  rmShiftPeakAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ShiftPeak);
