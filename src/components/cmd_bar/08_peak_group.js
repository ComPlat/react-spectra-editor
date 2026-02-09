/* eslint-disable prefer-object-spread, react/function-component-definition */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';

import { setUiSweepType } from '../../actions/ui';
import { MuButton, commonStyle, focusStyle } from './common';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';
import Format from '../../helpers/format';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const PeakGroup = ({
  classes, feature, isSelectingGroupSt, setUiSweepTypeAct,
  graphIndex,
}) => {
  if (!feature || !feature.operation) {
    return null;
  }
  const { operation } = feature;
  const { layout } = operation || {};
  if (!layout || !Format.isLCMsLayout(layout)) {
    return null;
  }
  const onSelectPeakGroup = () => {
    const payload = {
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT,
    };
    setUiSweepTypeAct(payload);
  };

  return (
    <span className={classes.group} data-testid="Zoom">
      <Tooltip title={<span className="txt-sv-tp">Select peak group</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(isSelectingGroupSt, classes),
              'btn-sv-bar-zoomin',
            )
          }
          onClick={onSelectPeakGroup}
        >
          <TroubleshootIcon className={classNames(classes.icon, classes.iconWp)} />
        </MuButton>
      </Tooltip>
    </span>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    isSelectingGroupSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
  }, dispatch)
);

PeakGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  isSelectingGroupSt: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
  graphIndex: PropTypes.number.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(PeakGroup);
