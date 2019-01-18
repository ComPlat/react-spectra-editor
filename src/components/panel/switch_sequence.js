import React from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SwtichSequence = ({ isAscend, onToggleSwitch }) => {
  const label = isAscend ? 'Ascend' : 'Descend';

  return (
    <FormControlLabel
      control={(
        <Switch
          checked={isAscend}
          onChange={onToggleSwitch}
          value="sequence"
          color="primary"
        />
      )}
      label={`${label} peaks.`}
    />
  );
};

SwtichSequence.propTypes = {
  isAscend: PropTypes.bool.isRequired,
  onToggleSwitch: PropTypes.func.isRequired,
};

export default SwtichSequence;
