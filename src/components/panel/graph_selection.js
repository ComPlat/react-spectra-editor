/* eslint-disable react/function-component-definition, function-paren-newline,
react/require-default-props, react/no-unused-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { withStyles } from '@mui/styles';
import {
  Accordion, AccordionSummary, ListItem, List, Tabs, Tab, Switch, FormControlLabel,
  Divider, Typography,
} from '@mui/material';
import { selectCurve, toggleShowAllCurves } from '../../actions/curve';
import { LIST_LAYOUT } from '../../constants/list_layout';

const styles = () => ({
  panelSummary: {
    height: 22,
  },
  curve: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  curveLabel: {
    minWidth: 0,
    flex: '0 1 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  curveTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  line: {
    width: '100%',
    height: 3,
    borderWidth: '0',
    margin: '0',
    borderRadius: 2,
    opacity: 1,
  },
  lineContainer: {
    flex: '1 1 56px',
    minWidth: 56,
    display: 'flex',
    alignItems: 'center',
  },
  curveDefault: {
    backgroundColor: '#fff',
    fontSize: '0.8em',
    color: 'rgba(0, 0, 0, 0.87)',
    margin: '0',
    padding: '9px 12px 9px 9px',
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
    '&:hover': {
      backgroundColor: '#f7fbff',
      borderLeftColor: '#c9d8e5',
    },
  },
  curveSelected: {
    backgroundColor: '#edf6ff',
    fontSize: '0.8em',
    color: '#0b5cad',
    fontWeight: 600,
    padding: '9px 12px 9px 9px',
    cursor: 'pointer',
    borderLeft: '3px solid #2196f3',
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
    '&:hover': {
      backgroundColor: '#e4f1ff',
    },
  },
});

const fallbackName = (entityFileNames, idx) => {
  if (entityFileNames && idx < entityFileNames.length) {
    return entityFileNames[idx];
  }
  return '';
};

const displayName = (spectra, idx, entityFileNames) => (
  spectra?.title
  || spectra?.feature?.title
  || spectra?.spectrum?.title
  || fallbackName(entityFileNames, idx)
  || `Spectrum ${idx + 1}`
);

const renderCurveItem = (classes, item, curveIdx, onChange) => (
  <ListItem
    key={item.idx}
    onClick={() => onChange(item.idx)}
    className={
      classNames((item.idx === curveIdx ? classes.curveSelected : classes.curveDefault))  // eslint-disable-line
    }
  >
    <span className={classNames(classes.curve)}>
      <span className={classNames(classes.curveLabel)}>
        <i>{ item.name }</i>
        <span className={classNames(classes.curveTitle)}>{ item.label }</span>
      </span>
      <span className={classNames(classes.lineContainer)}>
        <hr
          className={classNames(classes.line)}
          style={{ backgroundColor: item.color }}
        />
      </span>
    </span>
  </ListItem>
);

const GraphSelectionPanel = ({
  classes, curveSt,
  entityFileNames, subLayoutsInfo, layoutSt,
  selectCurveAct, toggleShowAllCurveAct, expand, onExapnd,
}) => {
  let subLayoutValues = [];
  if (subLayoutsInfo) {
    subLayoutValues = Object.keys(subLayoutsInfo);
  }

  const [selectedSubLayout, setSelectedSublayout] = useState(subLayoutValues[0]);

  useEffect(() => {
    setSelectedSublayout(subLayoutValues[0]);
  }, subLayoutValues);

  if (!curveSt) {
    return (<span />);
  }
  const { curveIdx, listCurves, isShowAllCurve } = curveSt;
  if (!listCurves) {
    return (<span />);
  }

  const onChange = (idx) => {
    selectCurveAct(idx);
  };

  const onChangeTabSubLayout = (event, newValue) => {
    setSelectedSublayout(newValue);
  };

  const onChangeSwitch = (event) => {
    toggleShowAllCurveAct(event.target.checked);
  };

  let itemsSubLayout = [];
  if (selectedSubLayout && subLayoutValues.length > 1) {
    const subLayout = subLayoutsInfo[selectedSubLayout];
    try {
      itemsSubLayout = subLayout.map((spectra, idx) => {
        const spectraIdx = spectra.curveIdx;
        const { color } = spectra;
        return {
          name: `${idx + 1}.`,
          idx: spectraIdx,
          color,
          label: displayName(spectra, spectraIdx, entityFileNames),
        };
      });
    } catch (e) {
      console.log(e); //eslint-disable-line
    }
  }

  const items = listCurves.map((spectra, idx) => {
    const { color } = spectra;
    return {
      name: `${idx + 1}.`,
      idx,
      color,
      label: displayName(spectra, idx, entityFileNames),
    };
  });

  return (
    <Accordion
      data-testid="GraphSelectionPanel"
      expanded={expand}
      onChange={onExapnd}
      disableGutters
      sx={{
        '&.MuiAccordion-root.Mui-expanded': { margin: 0 },
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={classNames(classes.panelSummary)}
      >
        <Typography className="txt-panel-header">
          <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
            Graph selection
          </span>
        </Typography>
      </AccordionSummary>
      <Divider />
      {
        layoutSt === LIST_LAYOUT.AIF ? (
          <FormControlLabel
            control={
              <Switch checked={isShowAllCurve} onChange={onChangeSwitch} />
            }
            label="Show all curves"
          />
        ) : null
      }
      {
        (subLayoutValues && subLayoutValues.length > 1) ? (
          <div>
            <Tabs value={selectedSubLayout} onChange={onChangeTabSubLayout}>
              {
                subLayoutValues.map((subLayout, i) => {
                  let subLayoutName = '';
                  switch (subLayout.toUpperCase()) {
                    case 'G/MOL':
                      subLayoutName = 'MWD';
                      break;
                    case 'MILLILITERS':
                      subLayoutName = 'ELU';
                      break;
                    case 'INTENSITY':
                      subLayoutName = 'Chromatogram';
                      break;
                    case 'DEGREES CELSIUS':
                      subLayoutName = 'Temperature';
                      break;
                    default:
                      break;
                  }
                  return (<Tab key={i} value={subLayout} label={subLayoutName} />);
                })
              }
            </Tabs>
            <List>
              {
                itemsSubLayout.map((item) => renderCurveItem(classes, item, curveIdx, onChange))
              }
            </List>
          </div>
        )
          : (
            <List>
              {
                items.map((item) => renderCurveItem(classes, item, curveIdx, onChange))
              }
            </List>
          )
      }
    </Accordion>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
    curveSt: state.curve,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    selectCurveAct: selectCurve,
    toggleShowAllCurveAct: toggleShowAllCurves,
  }, dispatch)
);

GraphSelectionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  layoutSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func.isRequired,
  curveSt: PropTypes.object.isRequired,
  selectCurveAct: PropTypes.func.isRequired,
  entityFileNames: PropTypes.array.isRequired,
  subLayoutsInfo: PropTypes.object,
  toggleShowAllCurveAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(GraphSelectionPanel));
