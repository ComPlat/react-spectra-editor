import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import SpellcheckOutlinedIcon from '@material-ui/icons/SpellcheckOutlined';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import ZoomInOutlinedIcon from '@material-ui/icons/ZoomInOutlined';
import AddLocationOutlinedIcon from '@material-ui/icons/AddLocationOutlined';
import FindReplaceOutlinedIcon from '@material-ui/icons/FindReplaceOutlined';

import { setUiViewerType, setUiSweepType } from '../../actions/ui';
import {
  LIST_UI_VIEWER_TYPE,
  LIST_UI_SWEEP_TYPE,
} from '../../constants/list_ui';
import Layout from './layout';
import Threshold from './threshold';
import Submit from './submit';
import Integration from './integration';
import Multiplicity from './multiplicity';
import UndoRedo from './undo_redo';
import Cfg from '../../helpers/cfg';
import { MuButton, commonStyle, focusStyle } from './common';

const styles = () => (
  Object.assign(
    {},
    {
      card: {
        margin: '0 0 5px 52px',
        border: '1px solid white',
        borderRadius: 4,
      },
      groupRightMost: {
        display: 'inline-block',
        float: 'right',
        margin: '0px 0px 0px 10px',
        verticalAlign: 'middle',
      },
      groupRight: {
        display: 'inline-block',
        float: 'right',
        margin: '0px 0px 0px 10px',
        verticalAlign: 'middle',
      },
    },
    commonStyle,
  )
);

const GroupViewer = ({
  classes, uiSt, layoutSt, setUiViewerTypeAct,
}) => {
  const { viewer } = uiSt;
  const onViewSpectrum = () => setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.SPECTRUM);
  const onViewAnalysis = () => setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.ANALYSIS);

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Spectrum Viewer</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(viewer === LIST_UI_VIEWER_TYPE.SPECTRUM, classes),
              'btn-sv-bar-spctrum',
            )
          }
          onClick={onViewSpectrum}
        >
          <TimelineOutlinedIcon className={classes.icon} />
        </MuButton>
      </Tooltip>
      {
        Cfg.hideCmdAnaViewer(layoutSt)
          ? null
          : (
            <Tooltip title={<span className="txt-sv-tp">Analysis Viewer</span>}>
              <MuButton
                className={
                  classNames(
                    focusStyle(viewer === LIST_UI_VIEWER_TYPE.ANALYSIS, classes),
                    'btn-sv-bar-analysis',
                  )
                }
                disabled={Cfg.btnCmdAnaViewer(layoutSt)}
                onClick={onViewAnalysis}
              >
                <SpellcheckOutlinedIcon className={classes.icon} />
              </MuButton>
            </Tooltip>
          )
      }
    </span>
  );
};

GroupViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  setUiViewerTypeAct: PropTypes.func.isRequired,
};

const GroupIntegration = ({ classes }) => (
  <span className={classes.group}>
    <Integration />
  </span>
);

GroupIntegration.propTypes = {
  classes: PropTypes.object.isRequired,
};

const GroupMultiplicity = ({ classes }) => (
  <span className={classes.group}>
    <Multiplicity />
  </span>
);

GroupMultiplicity.propTypes = {
  classes: PropTypes.object.isRequired,
};

const GroupZoom = ({
  classes, uiSt, setUiSweepTypeAct,
}) => {
  const { sweepType } = uiSt;
  const onSweepZoomIn = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ZOOMIN);
  const onSweepZoomReset = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ZOOMRESET);

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Zoom In</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(sweepType === LIST_UI_SWEEP_TYPE.ZOOMIN, classes),
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

GroupZoom.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
};

const GroupPeak = ({
  classes, uiSt, layoutSt, setUiSweepTypeAct,
}) => {
  const { sweepType } = uiSt;
  const onSweepPeakAdd = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.PEAK_ADD);
  const onSweepPeakDELETE = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.PEAK_DELETE);
  const onSweepAnchorShift = () => setUiSweepTypeAct(LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT);
  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Add Peak</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(sweepType === LIST_UI_SWEEP_TYPE.PEAK_ADD, classes),
                'btn-sv-bar-addpeak',
              )
            }
            disabled={Cfg.btnCmdAddPeak(layoutSt)}
            onClick={onSweepPeakAdd}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-addpeak')}>P+</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove Peak</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(sweepType === LIST_UI_SWEEP_TYPE.PEAK_DELETE, classes),
                'btn-sv-bar-rmpeak',
              )
            }
            disabled={Cfg.btnCmdRmPeak(layoutSt)}
            onClick={onSweepPeakDELETE}
          >
            <span className={classNames(classes.txt, 'txt-sv-bar-rmpeak')}>P-</span>
          </MuButton>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Set Reference</span>}>
        <span>
          <MuButton
            className={
              classNames(
                focusStyle(sweepType === LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT, classes),
                'btn-sv-bar-setref',
              )
            }
            disabled={Cfg.btnCmdSetRef(layoutSt)}
            onClick={onSweepAnchorShift}
          >
            <AddLocationOutlinedIcon className={classes.icon} />
          </MuButton>
        </span>
      </Tooltip>
    </span>
  );
};

GroupPeak.propTypes = {
  classes: PropTypes.object.isRequired,
  uiSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
};


const GroupUndoRedo = () => (
  <UndoRedo />
);

GroupUndoRedo.propTypes = {
};

const GroupLayout = ({ classes, feature, hasEdit }) => (
  <span className={classes.groupRight}>
    <Layout feature={feature} hasEdit={hasEdit} />
  </span>
);

GroupLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
};

const GroupThreshold = ({ classes, feature, hasEdit }) => (
  <span className={classes.groupRight}>
    <Threshold feature={feature} hasEdit={hasEdit} />
  </span>
);

GroupThreshold.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
};

const GroupSubmit = ({ classes, operations, feature }) => (
  <span className={classes.groupRightMost}>
    <Submit
      operations={operations}
      feature={feature}
      hideSwitch={false}
      disabled={false}
    />
  </span>
);

GroupSubmit.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  operations: PropTypes.array.isRequired,
};

const CmdBar = ({
  classes, uiSt, layoutSt, feature, hasEdit, operations,
  setUiViewerTypeAct, setUiSweepTypeAct,
}) => (
  <div className={classes.card}>
    <GroupViewer
      classes={classes}
      uiSt={uiSt}
      layoutSt={layoutSt}
      setUiViewerTypeAct={setUiViewerTypeAct}
    />
    <GroupZoom
      classes={classes}
      uiSt={uiSt}
      setUiSweepTypeAct={setUiSweepTypeAct}
    />
    <GroupPeak
      classes={classes}
      uiSt={uiSt}
      layoutSt={layoutSt}
      setUiSweepTypeAct={setUiSweepTypeAct}
    />
    <GroupIntegration
      classes={classes}
    />
    <GroupMultiplicity
      classes={classes}
    />
    <GroupUndoRedo
      classes={classes}
    />
    <GroupSubmit
      classes={classes}
      operations={operations}
      feature={feature}
    />
    <GroupThreshold
      classes={classes}
      feature={feature}
      hasEdit={hasEdit}
    />
    <GroupLayout
      classes={classes}
      feature={feature}
      hasEdit={hasEdit}
    />
  </div>
);

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    uiSt: state.ui,
    layoutSt: state.layout,
    integrationSt: state.integration.present,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUiViewerTypeAct: setUiViewerType,
    setUiSweepTypeAct: setUiSweepType,
  }, dispatch)
);

CmdBar.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  operations: PropTypes.array.isRequired,
  uiSt: PropTypes.object.isRequired,
  layoutSt: PropTypes.string.isRequired,
  setUiViewerTypeAct: PropTypes.func.isRequired,
  setUiSweepTypeAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CmdBar);
