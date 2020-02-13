import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
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
import Cfg from '../../helpers/cfg';

const styles = () => ({
  card: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    height: 104,
    margin: '7px 0 5px 0',
  },
  cardTop: {
    margin: '4px 0 0 0',
  },
  group: {
    border: '2px solid white',
    borderRadius: 5,
    display: 'inline-block',
    margin: '3px 5px 3px 5px',
    verticalAlign: 'middle',
  },
  groupRight: {
    border: '2px solid white',
    borderRadius: 5,
    display: 'inline-block',
    float: 'right',
    margin: '3px 5px 3px 5px',
    verticalAlign: 'middle',
  },
  btn: {
    minWidth: 40,
  },
  btnTxt: {
    textIndent: -7,
    width: 10,
  },
  btnPeakTxt: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  btnHighlight: {
    backgroundColor: '#2196f3',
    color: '#fff',
    minWidth: 40,
    '&:hover': {
      backgroundColor: '#51c6f3',
    },
  },
  sweepWrap: {
    border: '1px dashed',
    borderRadius: '5px',
  },
});

const highlight = (criteria, cls) => (criteria ? cls.btnHighlight : cls.btn);

const GroupViewer = ({
  classes, uiSt, layoutSt, setUiViewerTypeAct,
}) => {
  const { viewer } = uiSt;
  const onViewSpectrum = () => setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.SPECTRUM);
  const onViewAnalysis = () => setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.ANALYSIS);

  return (
    <span className={classes.group}>
      <Tooltip title={<span className="txt-sv-tp">Spectrum Viewer</span>}>
        <Button
          className={
            highlight(viewer === LIST_UI_VIEWER_TYPE.SPECTRUM, classes)
          }
          onClick={onViewSpectrum}
        >
          <TimelineOutlinedIcon />
        </Button>
      </Tooltip>
      {
        Cfg.hideCmdAnaViewer(layoutSt)
          ? null
          : (
            <Tooltip title={<span className="txt-sv-tp">Analysis Viewer</span>}>
              <Button
                className={
                  highlight(viewer === LIST_UI_VIEWER_TYPE.ANALYSIS, classes)
                }
                disabled={Cfg.btnCmdAnaViewer(layoutSt)}
                onClick={onViewAnalysis}
              >
                <SpellcheckOutlinedIcon />
              </Button>
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
        <Button
          className={
            highlight(sweepType === LIST_UI_SWEEP_TYPE.ZOOMIN, classes)
          }
          onClick={onSweepZoomIn}
        >
          <ZoomInOutlinedIcon className={classes.sweepWrap} />
        </Button>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Reset Zoom</span>}>
        <Button
          className={classes.btn}
          onClick={onSweepZoomReset}
        >
          <FindReplaceOutlinedIcon />
        </Button>
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
          <Button
            className={
              highlight(sweepType === LIST_UI_SWEEP_TYPE.PEAK_ADD, classes)
            }
            disabled={Cfg.btnCmdAddPeak(layoutSt)}
            onClick={onSweepPeakAdd}
          >
            <span className={classNames(classes.btnPeakTxt, 'cmd-txt-btn')}>P+</span>
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Remove Peak</span>}>
        <span>
          <Button
            className={
              highlight(sweepType === LIST_UI_SWEEP_TYPE.PEAK_DELETE, classes)
            }
            disabled={Cfg.btnCmdRmPeak(layoutSt)}
            onClick={onSweepPeakDELETE}
          >
            <span className={classNames(classes.btnPeakTxt, 'cmd-txt-btn')}>P-</span>
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={<span className="txt-sv-tp">Set Reference</span>}>
        <span>
          <Button
            className={
              highlight(sweepType === LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT, classes)
            }
            disabled={Cfg.btnCmdSetRef(layoutSt)}
            onClick={onSweepAnchorShift}
          >
            <AddLocationOutlinedIcon />
          </Button>
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
  <span className={classes.groupRight}>
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
  <Card className={classes.card}>
    <div className={classes.cardTop}>
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
    <div>
      <GroupIntegration
        classes={classes}
      />
      <GroupMultiplicity
        classes={classes}
      />
      <GroupSubmit
        classes={classes}
        operations={operations}
        feature={feature}
      />
    </div>
  </Card>
);

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    uiSt: state.ui,
    layoutSt: state.layout,
    integrationSt: state.integration,
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
