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
    backgroundColor: '#eee',
    height: 22,
  },
  curveItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: '0.8em',
    padding: '6px 8px',
    margin: 0,
    cursor: 'pointer',
  },
  curveDefault: {
    backgroundColor: '#fff',
  },
  curveSelected: {
    backgroundColor: '#e0e0e0',
  },
  curveIndex: {
    flexShrink: 0,
    marginRight: '4px',
    fontStyle: 'italic',
  },
  curveLabel: {
    flexShrink: 0,
    marginRight: '8px',
    overflowWrap: 'anywhere',
  },
  colorBar: {
    flex: 1,
    height: '6px',
    borderRadius: '1px',
    minWidth: '24px',
    alignSelf: 'center',
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
    disablePadding
    onClick={() => onChange(item.idx)}
    className={classNames(
      classes.curveItem,
      item.idx === curveIdx ? classes.curveSelected : classes.curveDefault,
    )}
  >
    <span className={classes.curveIndex}>{item.name}</span>
    {item.label !== '' ? <span className={classes.curveLabel}>{item.label}</span> : null}
    <span
      className={classes.colorBar}
      style={{ backgroundColor: item.color }}
    />
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
  const subLayoutKey = subLayoutValues.join('|');

  const [selectedSubLayout, setSelectedSublayout] = useState(subLayoutValues[0]);
  const resolvedSelectedSubLayout = subLayoutValues.includes(selectedSubLayout)
    ? selectedSubLayout
    : (subLayoutValues[0] || false);

  useEffect(() => {
    setSelectedSublayout(subLayoutValues[0]);
  }, [subLayoutKey]);

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
    const subLayout = subLayoutsInfo?.[resolvedSelectedSubLayout];
    try {
      itemsSubLayout = Array.isArray(subLayout) ? subLayout.map((spectra, idx) => {
        const spectraIdx = spectra.curveIdx;
        const { color } = spectra;
        return {
          name: `${idx + 1}.`,
          idx: spectraIdx,
          color,
          label: displayName(spectra, spectraIdx, entityFileNames),
        };
      }) : [];
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
            Graph selections
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
            <Tabs value={resolvedSelectedSubLayout} onChange={onChangeTabSubLayout}>
              {
                subLayoutValues.map((subLayout) => {
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
                  return (<Tab key={subLayout} value={subLayout} label={subLayoutName} />);
                })
              }
            </Tabs>
            <List>
              {
                itemsSubLayout.map((item) => renderCurveItem(classes, item, curveIdx, onChange))
              }
            </List>
          </div>
        ) : (
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
  expand: PropTypes.bool,
  layoutSt: PropTypes.string.isRequired,
  onExapnd: PropTypes.func,
  onExpand: PropTypes.func,
  curveSt: PropTypes.object.isRequired,
  selectCurveAct: PropTypes.func.isRequired,
  entityFileNames: PropTypes.array,
  subLayoutsInfo: PropTypes.object,
  toggleShowAllCurveAct: PropTypes.func.isRequired,
};

GraphSelectionPanel.defaultProps = {
  entityFileNames: [],
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(GraphSelectionPanel));
