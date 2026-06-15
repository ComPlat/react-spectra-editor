/* eslint-disable no-mixed-operators, prefer-object-spread, react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import withStyles from '@mui/styles/withStyles';
import {
  Tooltip,
} from '@mui/material';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import FindReplaceOutlinedIcon from '@mui/icons-material/FindReplaceOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

import { MuButton, commonStyle, focusStyle } from './cmd_bar/common';
import Integration from './cmd_bar/04_integration';
import Peak from './cmd_bar/03_peak';
import { setUiSweepType } from '../actions/ui';
import { selectWavelength, uvvisUndo, uvvisRedo } from '../actions/hplc_ms';
import { LIST_UI_SWEEP_TYPE } from '../constants/list_ui';
import renderWavelengthSelect from '../features/lc-ms/ui/wavelengthSelect';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const zoomView = (classes, graphIndex, uiSt, zoomInAct) => {
  const onSweepZoomIn = () => {
    zoomInAct({
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
    });
  };

  const onSweepZoomReset = () => {
    zoomInAct({
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMRESET,
    });
    zoomInAct({
      graphIndex,
      sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
    });
  };

  const { zoom } = uiSt;
  const { sweepTypes } = zoom;
  const isZoomFocus = sweepTypes[graphIndex] === LIST_UI_SWEEP_TYPE.ZOOMIN;

  return (
    <span className={classes.group} data-testid="Zoom">
      <Tooltip title={<span className="txt-sv-tp">Zoom In</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(isZoomFocus, classes),
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
          className="btn-sv-bar-zoomreset"
          onClick={onSweepZoomReset}
        >
          <FindReplaceOutlinedIcon className={classes.icon} />
        </MuButton>
      </Tooltip>
    </span>
  );
};

const wavelengthSelect = (classes, hplcMsSt, updateWavelengthAct) => (
  renderWavelengthSelect(classes, hplcMsSt, updateWavelengthAct, {
    labelId: 'lcms-select-wavelength-label',
    label: 'Wavelength (nm)',
  })
);

const LcMsUvToolsBar = ({
  classes, uiSt, hplcMsSt, feature, zoomInAct, selectWavelengthAct,
  uvvisUndoAct, uvvisRedoAct,
}) => {
  const handleWavelengthChange = (event) => {
    selectWavelengthAct(event);
  };
  const hist = hplcMsSt?.uvvisEditHistory || { past: [], future: [] };
  const canUndo = hist.past && hist.past.length > 0;
  const canRedo = hist.future && hist.future.length > 0;

  return (
    <>
      {zoomView(classes, 0, uiSt, zoomInAct)}
      {wavelengthSelect(classes, hplcMsSt, handleWavelengthChange)}
      <Integration />
      <Peak feature={feature || {}} />
      <span className={classes.group} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Tooltip title={<span className="txt-sv-tp">Undo</span>}>
          <MuButton
            className="btn-sv-bar-uvvis-undo"
            disabled={!canUndo}
            onClick={() => uvvisUndoAct()}
          >
            <UndoIcon className={classes.icon} />
          </MuButton>
        </Tooltip>
        <Tooltip title={<span className="txt-sv-tp">Redo</span>}>
          <MuButton
            className="btn-sv-bar-uvvis-redo"
            disabled={!canRedo}
            onClick={() => uvvisRedoAct()}
          >
            <RedoIcon className={classes.icon} />
          </MuButton>
        </Tooltip>
      </span>
    </>
  );
};

const mapStateToProps = (state) => {
  const { curveIdx, listCurves } = state.curve;
  const entity = listCurves[curveIdx];
  const displayFeature = entity?.feature
    || (listCurves[0]?.feature)
    || (listCurves[0]?.features?.[0])
    || {};
  return {
    uiSt: state.ui,
    hplcMsSt: state.hplcMs,
    feature: displayFeature,
  };
};

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    zoomInAct: setUiSweepType,
    selectWavelengthAct: selectWavelength,
    uvvisUndoAct: uvvisUndo,
    uvvisRedoAct: uvvisRedo,
  }, dispatch)
);

LcMsUvToolsBar.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  hplcMsSt: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  zoomInAct: PropTypes.func.isRequired,
  selectWavelengthAct: PropTypes.func.isRequired,
  uvvisUndoAct: PropTypes.func.isRequired,
  uvvisRedoAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(LcMsUvToolsBar);
