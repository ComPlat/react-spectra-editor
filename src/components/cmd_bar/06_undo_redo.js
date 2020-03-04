import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import RedoOutlinedIcon from '@material-ui/icons/RedoOutlined';
import UndoOutlinedIcon from '@material-ui/icons/UndoOutlined';
import { MuButton, commonStyle } from './common';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const UndoRedo = ({
  classes, canUndo, canRedo, onUndoAct, onRedoAct,
}) => (
  <span className={classes.group}>
    <Tooltip title={<span className="txt-sv-tp">Undo</span>}>
      <span>
        <MuButton
          className={
            classNames(
              'btn-sv-bar-undo',
            )
          }
          disabled={!canUndo}
          onClick={onUndoAct}
        >
          <UndoOutlinedIcon className={classes.icon} />
        </MuButton>
      </span>
    </Tooltip>
    <Tooltip title={<span className="txt-sv-tp">Redo</span>}>
      <span>
        <MuButton
          className={
            classNames(
              'btn-sv-bar-redo',
            )
          }
          disabled={!canRedo}
          onClick={onRedoAct}
        >
          <RedoOutlinedIcon className={classes.icon} />
        </MuButton>
      </span>
    </Tooltip>
  </span>
);

const canUndoFunc = state => (
  state.editPeak.past.length > 0
    || state.integration.past.length > 0
    || state.multiplicity.past.length > 0
);

const canRedoFunc = state => (
  state.editPeak.future.length > 0
    || state.integration.future.length > 0
    || state.multiplicity.future.length > 0
);

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    canUndo: canUndoFunc(state),
    canRedo: canRedoFunc(state),
  }
);

const mapDispatchToProps = dispatch => (
  {
    onUndoAct: () => dispatch(UndoActionCreators.undo()),
    onRedoAct: () => dispatch(UndoActionCreators.redo()),
  }
);

UndoRedo.propTypes = {
  classes: PropTypes.object.isRequired,
  canUndo: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  onUndoAct: PropTypes.func.isRequired,
  onRedoAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(UndoRedo);
