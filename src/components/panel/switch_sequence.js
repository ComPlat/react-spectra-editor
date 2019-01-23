import React from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SwtichSequence = ({ isAscend, onToggleSwitch }) => {
  const order = isAscend ? 'Ascend' : 'Descend';
  const label = (
    <p className="txt-panel-header">
      { `${order} peaks.` }
    </p>
  );

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
      label={label}
    />
  );
};

SwtichSequence.propTypes = {
  isAscend: PropTypes.bool.isRequired,
  onToggleSwitch: PropTypes.func.isRequired,
};

export default SwtichSequence;
