import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  btnRefresh: {
  },
});

const BtnRefresh = ({
  classes, disabled, refreshAct,
}) => (
  <IconButton
    disabled={disabled}
    variant="fab"
    color="primary"
    className={classNames(classes.btnRefresh)}
    onClick={refreshAct}
  >
    <Refresh />
  </IconButton>
);

BtnRefresh.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  refreshAct: PropTypes.func.isRequired,
};

export default withStyles(styles)(BtnRefresh);
