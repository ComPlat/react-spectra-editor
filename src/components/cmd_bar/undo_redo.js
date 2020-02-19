import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RedoOutlinedIcon from '@material-ui/icons/RedoOutlined';
import UndoOutlinedIcon from '@material-ui/icons/UndoOutlined';


const styles = () => ({
  group: {
    border: '2px solid white',
    borderRadius: 5,
    display: 'inline-block',
    margin: '3px 5px 3px 5px',
    verticalAlign: 'middle',
  },
  btn: {
    minWidth: 40,
  },
  btnPeakTxt: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

const UndoRedo = ({
  classes, canUndo, canRedo, onUndoAct, onRedoAct,
}) => (
  <span className={classes.group}>
    <Tooltip title={<span className="txt-sv-tp">Undo</span>}>
      <span>
        <Button
          className={classes.btn}
          disabled={!canUndo}
          onClick={onUndoAct}
        >
          <UndoOutlinedIcon />
        </Button>
      </span>
    </Tooltip>
    <Tooltip title={<span className="txt-sv-tp">Redo</span>}>
      <span>
        <Button
          className={classes.btn}
          disabled={!canRedo}
          onClick={onRedoAct}
        >
          <RedoOutlinedIcon />
        </Button>
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
