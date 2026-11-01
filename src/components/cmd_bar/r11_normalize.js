/* eslint-disable prefer-object-spread, react/function-component-definition */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined';
import Tooltip from '@mui/material/Tooltip';

import { setCurvesNormalized } from '../../actions/curve';
import { MuButton, commonStyle, focusStyle } from './common';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const Normalize = ({
  classes, isNormalizedSt, setCurvesNormalizedAct,
}) => {
  const onToggle = () => setCurvesNormalizedAct(!isNormalizedSt);
  const title = isNormalizedSt
    ? 'Show original intensities'
    : 'Normalize spectra (highest peaks = 100 %)';

  return (
    <span className={classes.group} data-testid="Normalize">
      <Tooltip title={<span className="txt-sv-tp">{title}</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(isNormalizedSt, classes),
                'btn-sv-bar-normalize',
              )
            }
            onClick={onToggle}
          >
            <HeightOutlinedIcon className={classes.icon} />
          </MuButton>
        </span>
      </Tooltip>
    </span>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    isNormalizedSt: !!state.curve.isNormalized,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setCurvesNormalizedAct: setCurvesNormalized,
  }, dispatch)
);

Normalize.propTypes = {
  classes: PropTypes.object.isRequired,
  isNormalizedSt: PropTypes.bool.isRequired,
  setCurvesNormalizedAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Normalize);
