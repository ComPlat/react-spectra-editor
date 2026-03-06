/* eslint-disable react/prop-types, react/require-default-props, max-len */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

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
import Format from '../../helpers/format';

const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    background: {
      default: '#D3D3D3',
    },
  },
});

const styles = () => ({
  panels: {
    maxHeight: 'calc(90vh - 220px)', // ROI
    display: 'table',
    overflowX: 'hidden',
    overflowY: 'auto',
    margin: '5px 0 0 0',
    padding: '0 0 0 0',
    width: '100%',
  },
});

class PanelViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: 'info',
    };

    this.onToggleExpand = this.onToggleExpand.bind(this);
    this.handleDescriptionChanged = this.handleDescriptionChanged.bind(this);
  }

  handleDescriptionChanged(content, delta, source, editor) {
    if (source === 'user') {
      const contentChanged = editor.getContents();
      this.props.onDescriptionChanged(contentChanged);  // eslint-disable-line
    }
  }

  onToggleExpand(input) {
    const { expand } = this.state;
    const nextExpand = input === expand ? '' : input;
    this.setState({ expand: nextExpand });
  }

  render() {
    const { expand } = this.state;
    const {
      classes, feature, integration, editorOnly, molSvg, descriptions, layoutSt,
      canChangeDescription, jcampIdx, entityFileNames, curveSt, userManualLink,
      subLayoutsInfo, exactMass, entities,
      hideCyclicVolta,
    } = this.props;
    const onExpandInfo = () => this.onToggleExpand('info');
    const onExpandPeak = () => this.onToggleExpand('peak');
    const onExpandMpy = () => this.onToggleExpand('mpy');
    const onExpandCompare = () => this.onToggleExpand('compare');
    const onExpandCyclicVolta = () => this.onToggleExpand('cyclicvolta');
    const onExpandGraphSelection = () => this.onToggleExpand('graph');
    const { listCurves } = curveSt;
    const curveCount = Array.isArray(listCurves) ? listCurves.length : 0;
    const hideGraphSelection = curveCount <= 1 || Format.isLCMsLayout(layoutSt);

    return (
      <div className={classNames(classes.panels)}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider
            theme={theme}
          >
            { hideGraphSelection ? null : <GraphSelectionPanel jcampIdx={jcampIdx} entityFileNames={entityFileNames} expand={expand === 'graph'} onExpand={onExpandGraphSelection} subLayoutsInfo={subLayoutsInfo} />}
            <InfoPanel
              entities={entities}
              feature={feature}
              integration={integration}
              editorOnly={editorOnly}
              expand={expand === 'info'}
              molSvg={molSvg}
              exactMass={exactMass}
              onExpand={onExpandInfo}
              descriptions={descriptions}
              canChangeDescription={canChangeDescription}
              onDescriptionChanged={this.handleDescriptionChanged}
            />
            { Cfg.hidePanelPeak(layoutSt) ? null : <PeakPanel expand={expand === 'peak'} onExapnd={onExpandPeak} /> }
            { Cfg.hidePanelMpy(layoutSt) ? null : <MultiplicityPanel expand={expand === 'mpy'} onExapnd={onExpandMpy} /> }
            { (Cfg.hidePanelCompare(layoutSt) || curveCount > 1) ? null : <ComparePanel expand={expand === 'compare'} onExapnd={onExpandCompare} /> }
            { (Cfg.hidePanelCyclicVolta(layoutSt) || hideCyclicVolta) ? null : (
              <CyclicVoltammetryPanel
                jcampIdx={jcampIdx}
                feature={feature}
                expand={expand === 'cyclicvolta'}
                onExapnd={onExpandCyclicVolta}
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

PanelViewer.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  integration: PropTypes.object,
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
  entities: PropTypes.array,
};

PanelViewer.defaultProps = {
  integration: {},
};

export default connect( // eslint-disable-line
  mapStateToProps, null,
)(withStyles(styles)(PanelViewer)); // eslint-disable-line
