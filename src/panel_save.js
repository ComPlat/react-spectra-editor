import React from 'react';
import PropTypes from 'prop-types';

import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import BtnSavePeaks from './panel_save_btn';

const SavePanel = ({
  savePeaks, peakObj,
}) => {
  if (!savePeaks) return null;

  return (
    <ExpansionPanelDetails>
      <BtnSavePeaks
        peakObj={peakObj}
        savePeaks={savePeaks}
      />
    </ExpansionPanelDetails>
  );
};

SavePanel.propTypes = {
  peakObj: PropTypes.object.isRequired,
  savePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
};

export default SavePanel;
