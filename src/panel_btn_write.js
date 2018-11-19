import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { PksEdit } from './helpers/converter';
import { Convert2Peak } from './helpers/chem';
import { toggleWriteBtn } from './actions/status';

const Styles = () => ({
  icon: {
  },
  btn: {
    margin: '20px 0 0 0',
  },
});

const onClickCb = (
  writePeaks, peaksEdit, layoutSt, toggleWriteBtnAct,
) => (
  () => {
    toggleWriteBtnAct();
    writePeaks(peaksEdit, layoutSt);
  }
);

const BtnWritePeaks = ({
  classes, writePeaks, peakObj, editPeakSt, thresSt, statusSt, layoutSt,
  toggleWriteBtnAct,
}) => {
  const peaks = Convert2Peak(peakObj, thresSt * 0.01);
  const peaksEdit = PksEdit(peaks, editPeakSt);
  const disable = peaksEdit.length === 0 || statusSt.btnWrite;
  if (!writePeaks) return null;

  return (
    <Tooltip
      title={<span className="txt-sv-tp">Write peaks</span>}
    >
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classNames(classes.btn)}
          onClick={onClickCb(
            writePeaks, peaksEdit, layoutSt, toggleWriteBtnAct,
          )}
          disabled={disable}
        >
          <EditIcon className={classes.icon} />
        </Button>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    editPeakSt: state.editPeak,
    thresSt: state.threshold,
    statusSt: state.status,
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleWriteBtnAct: toggleWriteBtn,
  }, dispatch)
);

BtnWritePeaks.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  editPeakSt: PropTypes.object.isRequired,
  statusSt: PropTypes.object.isRequired,
  thresSt: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ],
  ).isRequired,
  layoutSt: PropTypes.string.isRequired,
  toggleWriteBtnAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(BtnWritePeaks));
