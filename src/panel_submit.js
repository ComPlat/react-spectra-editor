import React from 'react';
import PropTypes from 'prop-types';

import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';

import BtnSavePeaks from './panel_btn_save';
import BtnWritePeaks from './panel_btn_write';

const SubmitPanel = ({
  savePeaks, writePeaks, peakObj,
}) => {
  if (!savePeaks && !writePeaks) return null;

  return (
    <ExpansionPanelDetails>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={6}>
          <BtnWritePeaks
            peakObj={peakObj}
            writePeaks={writePeaks}
          />
        </Grid>
        <Grid item xs={6}>
          <BtnSavePeaks
            peakObj={peakObj}
            savePeaks={savePeaks}
          />
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  );
};

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
};

export default SubmitPanel;
