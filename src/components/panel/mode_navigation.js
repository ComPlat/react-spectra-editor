import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';

import { TabLabel } from '../common/ui';
import { LIST_MODE } from '../../constants/list_mode';
import { setEditMode } from '../../actions/mode';

const styles = {
  root: {
  },
  tabLabel: {
    fontSize: '12px',
  },
};

const btnShift = (classes, enable) => (
  enable
    ? (
      <BottomNavigationAction
        label={TabLabel(classes, 'Set Shift', 'txt-shift-tab-label')}
        value={LIST_MODE.ANCHOR_SHIFT}
        icon={<LocationOnIcon />}
      />
    )
    : null
);

const ModeNavigation = ({
  classes, editModeSt, shiftEnableSt, setEditModeAct,
}) => {
  const onChange = (e, v) => setEditModeAct(v);

  return (
    <BottomNavigation
      value={editModeSt}
      onChange={onChange}
      className={classes.root}
    >
      { btnShift(classes, shiftEnableSt) }
      <BottomNavigationAction
        label={TabLabel(classes, 'Add Peak', 'txt-shift-tab-label')}
        value={LIST_MODE.ADD_PEAK}
        icon={<AddIcon />}
      />
      <BottomNavigationAction
        label={TabLabel(classes, 'Clear Peak', 'txt-shift-tab-label')}
        value={LIST_MODE.RM_PEAK}
        icon={<RemoveIcon />}
      />
    </BottomNavigation>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editModeSt: state.mode.edit,
    shiftEnableSt: state.shift.enable,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setEditModeAct: setEditMode,
  }, dispatch)
);

ModeNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  editModeSt: PropTypes.string.isRequired,
  shiftEnableSt: PropTypes.bool.isRequired,
  setEditModeAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ModeNavigation);
