import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators, compose } from 'redux';

import Tooltip from '@material-ui/core/Tooltip';
import GpsFixedOutlinedIcon from '@material-ui/icons/GpsFixedOutlined';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { commonStyle } from './common';
import Format from '../../helpers/format';
import { extractPeaksEdit } from '../../helpers/extractPeaksEdit';
import { setUiViewerType } from '../../actions/ui';
import { LIST_UI_VIEWER_TYPE } from '../../constants/list_ui';


const styles = () => (
  Object.assign(
    {},
    commonStyle,
    {
      tTxt: {
        fontSize: '0.8rem',
        fontFamily: 'Helvetica',
        marginRight: 5,
      },
      btnWidthIr: {
        minWidth: 30,
        width: 30,
      },
      btnWidthNmr: {
        minWidth: 80,
        width: 80,
      },
    },
  )
);

const MuPredictButton = withStyles({
  root: {
    border: '1px solid #ccc',
    borderRadius: 4,
    fontFamily: 'Helvetica',
    fontSize: 20,
    height: 30,
    lineHeight: '20px',
    padding: 0,
  },
})(Button);

const onClickFail = (layoutSt, simuCount, realCount) => {
  const feature = Format.is13CLayout(layoutSt) ? 'peak' : 'multiplet';

  return () => alert(`Selected ${feature} count (${realCount}) must be larger than 0, and must be eqal or less than simulated count (${simuCount}).`); // eslint-disable-line
};

const onClickReady = (
  forecast, peaksEdit, layoutSt, shiftSt, multiplicitySt, setUiViewerTypeAct,
) => {
  const { btnCb } = forecast;

  return () => {
    setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.ANALYSIS);

    return (
      btnCb({
        peaks: peaksEdit,
        layout: layoutSt,
        shift: shiftSt,
        multiplicity: multiplicitySt,
      })
    );
  };
};

const counterText = (classes, isIr, realCount, simuCount) => (
  isIr
    ? null
    : (
      <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>
        { `${realCount}/${simuCount}` }
      </span>
    )
);

const BtnPredict = ({
  classes, feature, forecast,
  layoutSt, simulationSt, editPeakSt, thresSt, shiftSt, multiplicitySt,
  setUiViewerTypeAct,
}) => {
  const is13Cor1H = Format.is13CLayout(layoutSt) || Format.is1HLayout(layoutSt);
  const isIr = Format.isIrLayout(layoutSt);
  if (!(is13Cor1H || isIr)) return null;

  const peaksEdit = extractPeaksEdit(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  const simuCount = simulationSt.nmrSimPeaks.length;
  const realCount = Format.is13CLayout(layoutSt)
    ? peaksEdit.length
    : multiplicitySt.stack.length;

  const predictable = isIr || (simuCount >= realCount && realCount > 0);
  const color = predictable ? 'green' : 'red';

  const onClick = predictable
    ? onClickReady(forecast, peaksEdit, layoutSt, shiftSt, multiplicitySt, setUiViewerTypeAct)
    : onClickFail(layoutSt, simuCount, realCount);

  const btnWidthCls = isIr ? classes.btnWidthIr : classes.btnWidthNmr;

  return (
    <Tooltip
      title={
        (
          <div>
            <span className="txt-sv-tp">Predict</span>
            <br />
            <span className="txt-sv-tp">
              - Selected features must be eqal or less than simulated features.
            </span>
          </div>
        )
      }
    >
      <MuPredictButton
        className={
          classNames(
            'btn-sv-bar-submit', btnWidthCls,
          )
        }
        style={{ color }}
        onClick={onClick}
      >
        {
          counterText(classes, isIr, realCount, simuCount)
        }
        <GpsFixedOutlinedIcon className={classes.icon} />
      </MuPredictButton>
    </Tooltip>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    simulationSt: state.simulation,
    editPeakSt: state.editPeak.present,
    thresSt: state.threshold,
    shiftSt: state.shift,
    multiplicitySt: state.multiplicity.present,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUiViewerTypeAct: setUiViewerType,
  }, dispatch)
);

BtnPredict.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  forecast: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  simulationSt: PropTypes.array.isRequired,
  editPeakSt: PropTypes.object.isRequired,
  thresSt: PropTypes.object.isRequired,
  shiftSt: PropTypes.object.isRequired,
  multiplicitySt: PropTypes.object.isRequired,
  setUiViewerTypeAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(BtnPredict);
