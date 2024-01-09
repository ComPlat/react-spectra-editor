/* eslint-disable react/function-component-definition */
/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Accordion, AccordionSummary, Divider, Typography, Table, TableBody, TableCell, TableHead,
  TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { withStyles } from '@mui/styles';

const styles = (theme) => ({
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
  txtBadge: {},
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  tRowHead: {
    backgroundColor: '#999',
    height: 32,
  },
  tTxtHead: {
    color: 'white',
    padding: '5px 5px 5px 5px',
  },
  tTxt: {
    padding: '4px 0 4px 0',
  },
  tRow: {
    height: 28,
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  rmBtn: {
    color: 'red',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: 'red',
      color: 'white',
    },
  },
});

const calculateT95AndT5 = (curveData) => {
  const { x, y } = curveData;

  const findAverageInYInterval = (targetY, tolerance) => {
    const matchingIndices = y.reduce((indices, currentY, currentIndex) => {
      if (Math.abs(currentY - targetY) <= tolerance) {
        indices.push(currentIndex);
      }
      return indices;
    }, []);

    if (matchingIndices.length === 0) {
      return null;
    }

    // eslint-disable-next-line max-len
    const averageXInInterval = matchingIndices.reduce((sum, index) => sum + x[index], 0) / matchingIndices.length;
    return averageXInInterval.toFixed(2);
  };

  const T5 = findAverageInYInterval(95, 0.002);
  const T95 = findAverageInYInterval(5, 0.002);

  return { T95, T5 };
};

const DecompositionTemperaturePanel = ({
  curveSt, classes, expand, onExapnd,
}) => {
  const { listCurves } = curveSt;

  if (!listCurves || listCurves.length === 0) {
    return null;
  }

  const weightCurve = listCurves.find((curve) => curve.feature.yUnit.toLowerCase().includes('weight')
  && !curve.feature.yUnit.toLowerCase().includes('deriv'));

  if (!weightCurve) {
    return null;
  }

  const { feature } = weightCurve;
  const { T95, T5 } = calculateT95AndT5(feature.data[0]);

  return (
    <Accordion
      data-testid="TemperaturePanelInfo"
      expanded={expand}
      onChange={onExapnd}
      className={classNames(classes.panel)}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Decomposition Temperatures</Typography>
      </AccordionSummary>
      <Divider />
      <div className={classNames(classes.panelDetail)}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tRowHead}>
              <TableCell align="center" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>
                T
                <sub>5%</sub>
                (°C)
              </TableCell>
              <TableCell align="center" className={classNames(classes.tTxtHead, 'txt-sv-panel-head')}>
                T
                <sub>95%</sub>
                (°C)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.tRow} hover>
              <TableCell align="center" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{T5}</TableCell>
              <TableCell align="center" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>{T95}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Accordion>
  );
};

const mapStateToProps = (state, props) => ({
  curveSt: state.curve,
});

DecompositionTemperaturePanel.propTypes = {
  classes: PropTypes.object.isRequired,
  curveSt: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  onExapnd: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(DecompositionTemperaturePanel));
