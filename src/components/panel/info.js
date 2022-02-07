import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SvgFileZoomPan from '@complat/react-svg-file-zoom-pan';
import ReactQuill from 'react-quill';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Format from '../../helpers/format';

const styles = () => ({
  chip: {
    margin: '1px 0 1px 0',
  },
  panel: {
    backgroundColor: '#eee',
    display: 'table-row',
  },
  panelSummary: {
    backgroundColor: '#eee',
    height: 32,
  },
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: 'auto',
  },
  rowRoot: {
    border: '1px solid #eee',
    height: 36,
    lineHeight: '36px',
    overflow: 'hidden',
    paddingLeft: 24,
    textAlign: 'left',
  },
  rowOdd: {
    backgroundColor: '#fff',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowEven: {
    backgroundColor: '#fafafa',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowOddSim: {
    backgroundColor: '#fff',
    height: 108,
    lineHeight: '24px',
    overflowY: 'scroll',
    overflowWrap: 'word-break',
  },
  tHead: {
    fontWeight: 'bold',
    float: 'left',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  tTxt: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    marginRight: 3,
  },
  quill: {
    backgroundColor: '#fafafa',
    border: '1px solid #eee',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
    padding: '0 10px 0 10px',
    textAlign: 'left',
  },
});

const simTitle = () => (
  'Simulated signals from NMRshiftDB'
);

const simContent = nmrSimPeaks => (
  nmrSimPeaks && nmrSimPeaks.sort((a, b) => a - b).join(', ')
);

const aucValue = integration => {
  if (!integration) {
    return "";
  }
  let values = [];
  let stackIntegration = integration.stack;
  if (Array.isArray(stackIntegration)) {
    let sumVal = 0.0;
    stackIntegration.forEach(inte => {
      if (inte.absoluteArea) {
        sumVal += inte.absoluteArea;
      }
    });
    sumVal = sumVal.toFixed(2);
    stackIntegration.forEach(inte => {
      if (inte.absoluteArea) {
        const areaVal = inte.absoluteArea.toFixed(2);
        const percent = (areaVal*100/sumVal).toFixed(2);
        const valStr = areaVal + " (" + percent + "%)";
        values.push(valStr);
      }
    })
  }
  return values.join(", ");
}

const InfoPanel = ({
  classes, expand, feature, integration, editorOnly, molSvg, descriptions,
  layoutSt, simulationSt, shiftNameSt,
  onExapnd, canChangeDescription, onDescriptionChanged
}) => {
  if (!feature) return null;
  const { title, observeFrequency, solventName } = feature;
  const showSolvName = shiftNameSt === '- - -' ? solventName : shiftNameSt;

  let originStack = null;
  if (integration) {
    originStack = integration.originStack;
  }
  
  return (
    <ExpansionPanel
      expanded={expand}
      onChange={onExapnd}
      className={classNames(classes.panel)}
      TransitionProps={{ unmountOnExit: true }} // increase ExpansionPanel performance
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Info
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        <div className={classNames(classes.rowRoot, classes.rowOdd)}>
          <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Title : </span>
          <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ title }</span>
        </div>
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowRoot, classes.rowEven)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Freq : </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{ parseInt(observeFrequency, 10) || ' - ' }</span>
              </div>
            )
            : null
        }
        {
          Format.isNmrLayout(layoutSt)
            ? (
              <div className={classNames(classes.rowRoot, classes.rowOdd)}>
                <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>Solv : </span>
                <span className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{showSolvName}</span>
              </div>
            )
            : null
        }
        {
          !molSvg
            ? null
            : (
              <SvgFileZoomPan
                svg={molSvg}
                duration={300}
                resize
              />
            )
        }
        {
          (Format.isHplcUvVisLayout(layoutSt)) ? (
            <div className={classNames(classes.rowRoot, classes.rowOddSim)}>
              <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>
                Area under curve (AUC):
              </span>
              <br />
              <span className={classNames(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')}>
              {aucValue(integration)}
              </span>
            </div>
          )
          : null
        }
      </div>
      {/* <ReactQuill
        className={classNames(classes.quill, 'card-sv-quill')}
        value={descriptions}
        modules={{ toolbar: false }}
        readOnly
      /> */}
      <ReactQuill
        className={classNames(classes.quill, 'card-sv-quill')}
        value={descriptions}
        modules={{ toolbar: false }}
        onChange={onDescriptionChanged}
        readOnly={canChangeDescription !== undefined ? !canChangeDescription : true}
      />
      <div>
        {
            !editorOnly && Format.isNmrLayout(layoutSt)
              ? (
                <div className={classNames(classes.rowRoot, classes.rowOddSim)}>
                  <span className={classNames(classes.tTxt, classes.tHead, 'txt-sv-panel-txt')}>
                    { simTitle() }
                    :
                  </span>
                  <br />
                  <span className={classNames(classes.tTxt, classes.tTxtSim, 'txt-sv-panel-txt')}>
                    { simContent(simulationSt.nmrSimPeaks) }
                  </span>
                </div>
              )
              : null
          }
      </div>
    </ExpansionPanel>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    simulationSt: state.simulation,
    shiftNameSt: state.shift.ref.name,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
);

InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  feature: PropTypes.object.isRequired,
  integration: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  molSvg: PropTypes.string.isRequired,
  descriptions: PropTypes.array.isRequired,
  layoutSt: PropTypes.string.isRequired,
  simulationSt: PropTypes.array.isRequired,
  shiftNameSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(withStyles(styles)(InfoPanel));
