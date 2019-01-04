import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
  },
  avatar: {
    margin: 10,
  },
  panelSummary: {
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 10,
  },
  contentTxt: {
    marginBottom: 10,
    height: 30,
  },
  actionTxt: {
    color: '#aa6',
  },
};

const title = classes => (
  <ExpansionPanelSummary
    expandIcon={<ExpandMoreIcon />}
    className={classNames(classes.panelSummary)}
  >
    <Typography className="txt-panel-header">
      Info
    </Typography>
  </ExpansionPanelSummary>
);

const content = classes => (
  <div className={classNames(classes.content)}>
    <Typography className={classNames(classes.contentTxt, 'txt-panel-content')}>
      <i className={classNames(classes.actionTxt)}>
        Right-click
      </i>
      <span> to reset zoom!</span>
    </Typography>
    <Typography className={classNames(classes.contentTxt, 'txt-panel-content')}>
      <i className={classNames(classes.actionTxt)}>
        Left-click
      </i>
      <span> to SetShift, AddPeak or ClearPeak, base on the selection.</span>
    </Typography>
  </div>
);

const Manual = ({ classes }) => (
  <ExpansionPanel>
    { title(classes) }
    <Divider />
    { content(classes) }
  </ExpansionPanel>
);

Manual.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Manual);
