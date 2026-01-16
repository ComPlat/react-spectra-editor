/* eslint-disable prefer-object-spread, react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

import Tooltip from '@mui/material/Tooltip';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import withStyles from '@mui/styles/withStyles';

import { setUiAlignCompareX } from '../../actions/ui';
import { MuButton, commonStyle, focusStyle } from './common';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const AlignCompareX = ({
  classes, alignCompareXSt, isMultiSpectraSt, setUiAlignCompareXAct, compact,
}) => {
  if (!isMultiSpectraSt) return null;

  const onToggle = () => setUiAlignCompareXAct(!alignCompareXSt);

  return (
    <span className={compact ? undefined : classes.group} data-testid="AlignCompareX">
      <Tooltip title={<span className="txt-sv-tp">Align X (compare)</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(alignCompareXSt, classes),
              'btn-sv-bar-align-compare-x',
            )
          }
          onClick={onToggle}
        >
          <SwapHorizOutlinedIcon className={classes.icon} />
        </MuButton>
      </Tooltip>
    </span>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    alignCompareXSt: state.ui.alignCompareX,
    isMultiSpectraSt: (state.curve.listCurves || []).length > 1,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiAlignCompareXAct: setUiAlignCompareX,
  }, dispatch)
);

AlignCompareX.propTypes = {
  classes: PropTypes.object.isRequired,
  alignCompareXSt: PropTypes.bool.isRequired,
  isMultiSpectraSt: PropTypes.bool.isRequired,
  setUiAlignCompareXAct: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};

AlignCompareX.defaultProps = {
  compact: false,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(AlignCompareX);
