/* eslint-disable prefer-object-spread, function-paren-newline,
max-len, react/function-component-definition,
function-call-argument-newline, react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators, compose } from 'redux';

import {
  Tooltip, Button,
} from '@mui/material';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { withStyles } from '@mui/styles';

import { commonStyle } from './common';
import Format from '../../helpers/format';
import { carbonFeatures } from '../../helpers/carbonFeatures';
import { extractPeaksEdit } from '../../helpers/extractPeaksEdit';
import { setUiViewerType } from '../../actions/ui';
import { LIST_UI_VIEWER_TYPE } from '../../constants/list_ui';
import { Convert2Scan, Convert2Thres } from '../../helpers/chem';

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
      btnWidthUnknown: {
        minWidth: 30,
        width: 30,
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
  forecast, peaksEdit, layoutSt, scan, shiftSt, thres,
  analysis, integrationSt, multiplicitySt, setUiViewerTypeAct,
  curveSt,
) => {
  const { btnCb } = forecast;
  if (!btnCb) {
    return () => alert('[Developer Warning] You need to implement btnCb in forecast!'); // eslint-disable-line
  }

  return () => {
    setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.ANALYSIS);

    return (
      btnCb({
        peaks: peaksEdit,
        layout: layoutSt,
        scan,
        thres,
        analysis,
        integration: integrationSt,
        multiplicity: multiplicitySt,
        shift: shiftSt,
        curveSt,
      })
    );
  };
};

const onClicUnknown = (
  feature, forecast, peaksEdit, layoutSt, scan, shiftSt, thres,
  analysis, integrationSt, multiplicitySt, curveSt,
) => {
  const { refreshCb } = forecast;
  if (!refreshCb) {
    return () => alert('[Developer Warning] You need to implement refreshCb in forecast!'); // eslint-disable-line
  }

  return () => (
    refreshCb({
      peaks: peaksEdit,
      layout: layoutSt,
      scan,
      shift: shiftSt,
      thres,
      analysis,
      integration: integrationSt,
      multiplicity: multiplicitySt,
      curveSt,
    })
  );
};

const counterText = (classes, isIr, realCount, uniqCount, simuCount) => (
  isIr
    ? null
    : (
      <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>
        { `${realCount}/${uniqCount}/${simuCount}` }
      </span>
    )
);

const renderBtnPredict = (
  classes, isIr, realCount, uniqCount, simuCount, color, btnWidthCls, onClick,
) => (
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
        counterText(classes, isIr, realCount, uniqCount, simuCount)
      }
      <GpsFixedOutlinedIcon className={classes.icon} />
    </MuPredictButton>
  </Tooltip>
);

const renderBtnUnknown = (
  classes, onClick,
) => (
  <Tooltip
    title={
      (
        <div>
          <span className="txt-sv-tp">Refresh Simulation</span>
          <br />
          <span className="txt-sv-tp">
            - Simulation must be refreshed before making a prediction.
          </span>
          <br />
          <span className="txt-sv-tp">
            - If you continue to see this button after clicking it, the server is not ready. Please wait for a while.
          </span>
        </div>
      )
    }
  >
    <MuPredictButton
      className={
        classNames(
          'btn-sv-bar-submit', classes.btnWidthUnknown,
        )
      }
      style={{ color: 'orange' }}
      onClick={onClick}
    >
      <HelpOutlineOutlinedIcon className={classes.icon} />
    </MuPredictButton>
  </Tooltip>
);

const BtnPredict = ({
  classes, feature, forecast,
  layoutSt, simulationSt, editPeakSt, scanSt, shiftSt, thresSt,
  integrationSt, multiplicitySt,
  setUiViewerTypeAct, curveSt,
}) => {
  const is13Cor1H = Format.is13CLayout(layoutSt) || Format.is1HLayout(layoutSt);
  const isIr = Format.isIrLayout(layoutSt);
  if (!(is13Cor1H || isIr)) return null;

  const oriPeaksEdit = extractPeaksEdit(feature, editPeakSt, thresSt, shiftSt, layoutSt);
  const peaksEdit = Format.rmShiftFromPeaks(oriPeaksEdit, shiftSt);
  const scan = Convert2Scan(feature, scanSt);
  const thres = Convert2Thres(feature, thresSt);
  const simuCount = simulationSt.nmrSimPeaks.length;
  const uniqCount = [...new Set(simulationSt.nmrSimPeaks)].length;
  let realCount = 0;
  if (Format.is13CLayout(layoutSt)) {
    realCount = carbonFeatures(peaksEdit, multiplicitySt).length;
  } else {
    const { curveIdx } = curveSt;
    const { multiplicities } = multiplicitySt;
    const selectedMultiplicity = multiplicities[curveIdx];
    const { stack } = selectedMultiplicity;
    realCount = stack.length;
  }

  if (is13Cor1H && simuCount === 0) {
    const onClickUnknownCb = onClicUnknown(
      feature, forecast, peaksEdit, layoutSt, scan, shiftSt, thres,
      forecast.predictions, integrationSt, multiplicitySt, curveSt,
    );
    return renderBtnUnknown(classes, onClickUnknownCb);
  }

  const predictable = isIr || (simuCount >= realCount && realCount > 0);
  const color = predictable ? 'green' : 'red';

  const onClick = predictable
    ? (
      onClickReady(
        forecast, peaksEdit, layoutSt, scan, shiftSt, thres,
        forecast.predictions, integrationSt, multiplicitySt, setUiViewerTypeAct, curveSt,
      )
    )
    : onClickFail(layoutSt, simuCount, realCount);

  const btnWidthCls = isIr ? classes.btnWidthIr : classes.btnWidthNmr;

  return (
    renderBtnPredict(
      classes, isIr, realCount, uniqCount, simuCount, color, btnWidthCls, onClick,
    )
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    simulationSt: state.simulation,
    editPeakSt: state.editPeak.present,
    scanSt: state.scan,
    shiftSt: state.shift,
    thresSt: state.threshold,
    integrationSt: state.integration.present,
    multiplicitySt: state.multiplicity.present,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
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
  scanSt: PropTypes.object.isRequired,
  shiftSt: PropTypes.object.isRequired,
  thresSt: PropTypes.object.isRequired,
  integrationSt: PropTypes.object.isRequired,
  multiplicitySt: PropTypes.object.isRequired,
  setUiViewerTypeAct: PropTypes.func.isRequired,
  curveSt: PropTypes.object,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(BtnPredict);
