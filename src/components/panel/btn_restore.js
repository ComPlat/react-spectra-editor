import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import CloudDone from '@material-ui/icons/CloudDone';
import HowToReg from '@material-ui/icons/HowToReg';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  btnRestore: {
  },
});

const restoreDisplay = (hasEdit, isEdit) => (
  hasEdit && isEdit ? <HowToReg /> : <CloudDone />
);

const restoreTp = (hasEdit, isEdit) => (
  hasEdit && isEdit ? 'User' : 'Automation'
);

const BtnRestore = ({
  classes, hasEdit, isEdit, toggleEditAct,
}) => (
  <Tooltip
    title={<span className="txt-sv-tp">{restoreTp(hasEdit, isEdit)}</span>}
  >
    <div>
      <IconButton
        disabled={!hasEdit}
        variant="fab"
        color="primary"
        className={classNames(classes.btnRestore)}
        onClick={toggleEditAct}
      >
        { restoreDisplay(hasEdit, isEdit) }
      </IconButton>
    </div>
  </Tooltip>
);

BtnRestore.propTypes = {
  classes: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  toggleEditAct: PropTypes.func.isRequired,
};

export default withStyles(styles)(BtnRestore);
