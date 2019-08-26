import React from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SwtichIntensity = ({ isIntensity, onToggleSwitch }) => {
  const order = isIntensity ? 'Show' : 'Hide';
  const label = (
    <p className="txt-panel-header txt-sequence">
      { `${order} Intensity.` }
    </p>
  );

  return (
    <FormControlLabel
      control={(
        <Switch
          checked={isIntensity}
          onChange={onToggleSwitch}
          value="sequence"
          color="primary"
        />
      )}
      label={label}
    />
  );
};

SwtichIntensity.propTypes = {
  isIntensity: PropTypes.bool.isRequired,
  onToggleSwitch: PropTypes.func.isRequired,
};

export default SwtichIntensity;
