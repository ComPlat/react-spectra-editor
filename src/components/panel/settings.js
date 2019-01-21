import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import LayoutPanel from './layout';
import SubmitPanel from './submit';
import ThresholdsPanel from './thresholds';
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
      Settings
    </Typography>
  </ExpansionPanelSummary>
);

const SettingsPanel = ({
  classes, peakObj, hasEdit, writePeaks, savePeaks,
}) => (
  <ExpansionPanel>
    { title(classes) }
    <LayoutPanel />
    <Divider />
    <ShiftSelect />
    <Divider />
    <ThresholdsPanel peakObj={peakObj} hasEdit={hasEdit} />
    <Divider />
    <SubmitPanel
      savePeaks={savePeaks}
      writePeaks={writePeaks}
      peakObj={peakObj}
    />
  </ExpansionPanel>
);

SettingsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  savePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
};

export default withStyles(Styles)(SettingsPanel);
