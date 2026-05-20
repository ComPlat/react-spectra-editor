/* eslint-disable react/prop-types, react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  createTheme, ThemeProvider, StyledEngineProvider,
} from '@mui/material/styles';

import withStyles from '@mui/styles/withStyles';

import InfoPanel from './info';
import PeakPanel from './peaks';
import ComparePanel from './compare';
import MultiplicityPanel from './multiplicity';
import CyclicVoltammetryPanel from './cyclic_voltamery_data';
import GraphSelectionPanel from './graph_selection';
import Cfg from '../../helpers/cfg';

const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    background: {
      default: '#fff',
    },
  },
});

const styles = () => ({
  panels: {
    maxHeight: 'calc(90vh - 220px)', // ROI
    display: 'block',
    overflowX: 'hidden',
    overflowY: 'auto',
    boxSizing: 'border-box',
    margin: '4px 4px 0 4px',
    padding: 0,
    width: 'calc(100% - 8px)',
    backgroundColor: '#fff',
    border: '1px solid #e1e5e8',
    borderRadius: 8,
    boxShadow: '0 4px 14px rgba(17, 24, 39, 0.05)',
    overflow: 'hidden auto',
    fontFamily: 'Helvetica, Arial, sans-serif',
    '& .MuiAccordion-root': {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e6e8eb',
      boxShadow: 'none',
    },
    '& .MuiAccordion-root:last-child': {
      borderBottom: 'none',
    },
    '& .MuiAccordion-root.Mui-expanded': {
      margin: 0,
    },
    '& .MuiAccordionSummary-root': {
      minHeight: 38,
      height: 38,
      padding: '0 12px',
      background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)',
      color: '#25313b',
      borderBottom: '1px solid transparent',
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: 38,
      height: 38,
      borderBottom: '1px solid #e1e5e8',
    },
    '& .MuiAccordionSummary-content': {
      margin: 0,
      alignItems: 'center',
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: 0,
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: '#66727c',
    },
    '& .txt-panel-header': {
      width: '100%',
    },
    '& .txt-sv-panel-title': {
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#25313b',
    },
    '& .MuiDivider-root': {
      display: 'none',
    },
    '& .MuiList-root': {
      padding: '4px 0',
    },
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd5df',
      borderRadius: 8,
    },
  },
});

class PanelViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: ['info', 'graph'],
    };

    this.onExapnd = this.onExapnd.bind(this);
    this.handleDescriptionChanged = this.handleDescriptionChanged.bind(this);
  }

  handleDescriptionChanged(content, delta, source, editor) {
    if (source === 'user') {
      const contentChanged = editor.getContents();
      this.props.onDescriptionChanged(contentChanged);  // eslint-disable-line
    }
  }

  onExapnd(input) {
    const { expand } = this.state;
    const nextExpand = expand.includes(input)
      ? expand.filter((item) => item !== input)
      : [...expand, input];
    this.setState({ expand: nextExpand });
  }

  render() {
    const { expand } = this.state;
    const {
      classes, feature, integration, editorOnly, molSvg, descriptions, layoutSt,
      canChangeDescription, jcampIdx, entityFileNames, curveSt, userManualLink,
      subLayoutsInfo, exactMass, hideCyclicVolta,
    } = this.props;
    const onExapndInfo = () => this.onExapnd('info');
    const onExapndPeak = () => this.onExapnd('peak');
    const onExapndMpy = () => this.onExapnd('mpy');
    const onExapndCompare = () => this.onExapnd('compare');
    const onExapndCyclicVolta = () => this.onExapnd('cyclicvolta');
    const onExapndGraphSelection = () => this.onExapnd('graph');
    const isExpanded = (name) => expand.includes(name);

    const { listCurves } = curveSt;
    const hideGraphSelection = listCurves === false || listCurves === undefined;

    return (
      <div className={classNames(classes.panels)}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider
            theme={theme}
          >
            { hideGraphSelection ? null : <GraphSelectionPanel jcampIdx={jcampIdx} entityFileNames={entityFileNames} expand={isExpanded('graph')} onExapnd={onExapndGraphSelection} subLayoutsInfo={subLayoutsInfo} />}
            <InfoPanel
              feature={feature}
              integration={integration}
              editorOnly={editorOnly}
              expand={isExpanded('info')}
              molSvg={molSvg}
              exactMass={exactMass}
              onExapnd={onExapndInfo}
              descriptions={descriptions}
              canChangeDescription={canChangeDescription}
              onDescriptionChanged={this.handleDescriptionChanged}
            />
            { Cfg.hidePanelPeak(layoutSt) ? null : <PeakPanel expand={isExpanded('peak')} onExapnd={onExapndPeak} /> }
            { Cfg.hidePanelMpy(layoutSt) ? null : <MultiplicityPanel expand={isExpanded('mpy')} onExapnd={onExapndMpy} /> }
            { (Cfg.hidePanelCompare(layoutSt) || listCurves.length > 1) ? null : <ComparePanel expand={isExpanded('compare')} onExapnd={onExapndCompare} /> }
            { (Cfg.hidePanelCyclicVolta(layoutSt) || hideCyclicVolta) ? null : (
              <CyclicVoltammetryPanel
                jcampIdx={jcampIdx}
                feature={feature}
                expand={isExpanded('cyclicvolta')}
                onExapnd={onExapndCyclicVolta}
                userManualLink={userManualLink ? userManualLink.cv : undefined}
              />
            )}
          </ThemeProvider>
        </StyledEngineProvider>
      </div>
    );
  }
}

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
  }, dispatch)
);

PanelViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  integration: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  molSvg: PropTypes.string.isRequired,
  descriptions: PropTypes.array.isRequired,
  layoutSt: PropTypes.string.isRequired,
  canChangeDescription: PropTypes.bool.isRequired,
  onDescriptionChanged: PropTypes.func,
  entityFileNames: PropTypes.array,
  userManualLink: PropTypes.object,
  curveSt: PropTypes.object.isRequired,
  subLayoutsInfo: PropTypes.object,
  exactMass: PropTypes.string,
  hideCyclicVolta: PropTypes.bool,
};

export default connect( // eslint-disable-line
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(PanelViewer)); // eslint-disable-line
