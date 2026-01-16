/* eslint-disable prefer-object-spread, react/function-component-definition */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import FindReplaceOutlinedIcon from '@mui/icons-material/FindReplaceOutlined';
import Tooltip from '@mui/material/Tooltip';

import { setUiSweepType } from '../../actions/ui';
import { MuButton, commonStyle, focusStyle } from './common';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';
import AlignCompareX from './r10_align_compare_x';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const Zoom = ({
  classes, isfocusZoomSt, curveIdx, setUiSweepTypeAct,
}) => {
  const onSweepZoomIn = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ZOOMIN, curveIdx);
  const onSweepZoomReset = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ZOOMRESET, curveIdx);

  return (
    <span className={classes.group} data-testid="Zoom">
      <Tooltip title={<span className="txt-sv-tp">Zoom In</span>}>
        <span>
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
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Reset Zoom</span>}>
        <span>
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
        </span>
      </Tooltip>
      <AlignCompareX compact />
    </span>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    isfocusZoomSt: state.ui.sweepType === LIST_UI_SWEEP_TYPE.ZOOMIN,
    curveIdx: state.curve.curveIdx,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiSweepTypeAct: setUiSweepType,
  }, dispatch)
);

Zoom.propTypes = {
  classes: PropTypes.object.isRequired,
  isfocusZoomSt: PropTypes.bool.isRequired,
  curveIdx: PropTypes.number.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Zoom);
