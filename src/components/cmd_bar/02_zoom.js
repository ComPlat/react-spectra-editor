import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ZoomInOutlinedIcon from '@material-ui/icons/ZoomInOutlined';
import FindReplaceOutlinedIcon from '@material-ui/icons/FindReplaceOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import { setUiSweepType } from '../../actions/ui';
import { MuButton, commonStyle, focusStyle } from './common';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const Zoom = ({
  classes, isfocusZoomSt, setUiSweepTypeAct,
}) => {
  const onSweepZoomIn = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ZOOMIN);
  const onSweepZoomReset = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ZOOMRESET);

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Zoom In</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(isfocusZoomSt, classes),
              'btn-sv-bar-zoomin',
            )
          }
          onClick={onSweepZoomIn}
        >
          <ZoomInOutlinedIcon className={classNames(classes.icon, classes.iconWp)} />
        </MuButton>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Reset Zoom</span>}>
        <MuButton
          className={
            classNames(
              'btn-sv-bar-zoomreset',
            )
          }
          onClick={onSweepZoomReset}
        >
          <FindReplaceOutlinedIcon className={classes.icon} />
        </MuButton>
      </Tooltip>
    </span>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    isfocusZoomSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.ZOOMIN,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
  }, dispatch)
);

Zoom.propTypes = {
  classes: PropTypes.object.isRequired,
  isfocusZoomSt: PropTypes.bool.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Zoom);
