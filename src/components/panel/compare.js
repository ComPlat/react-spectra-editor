/* eslint-disable function-paren-newline, react/jsx-props-no-spreading,
react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';

import {
  Accordion, AccordionSummary, Table, TableBody, TableCell, TableRow,
  Divider, Typography, Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { withStyles } from '@mui/styles';

import Format from '../../helpers/format';
import { rmOthersOne, toggleShow } from '../../actions/jcamp';

const styles = () => ({
  panel: {
    backgroundColor: '#fff',
    display: 'block',
  },
  panelSummary: {
    height: 32,
  },
  txtBadge: {
  },
  panelDetail: {
    backgroundColor: '#fff',
    maxHeight: 'calc(90vh - 220px)', // ROI
    overflow: 'auto',
  },
  table: {
    width: '100%',
  },
  tTxt: {
    color: '#3f4952',
    fontSize: '0.78rem',
    padding: 0,
  },
  tTxtHide: {
    color: '#b4bdc6',
  },
  tRow: {
    height: 28,
    borderBottom: '1px solid #edf0f2',
    '&:nth-of-type(even)': {
      backgroundColor: '#fbfcfd',
    },
  },
  rmBtn: {
    color: '#b42318',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: '#b42318',
      color: 'white',
    },
  },
  showBtn: {
    color: '#1976d2',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: '#1976d2',
      color: 'white',
    },
  },
  hideBtn: {
    color: '#66727c',
    padding: '0 5px 0 5px',
    '&:hover': {
      borderRadius: 12,
      backgroundColor: '#66727c',
      color: 'white',
    },
  },
  square: {
    textAlign: 'center !important',
  },
  baseDD: {
    backgroundColor: '#fff',
    border: '1px dashed #aeb8c2',
    borderRadius: 6,
    height: 26,
    lineHeight: '26px',
    margin: '7px 0 7px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%',
  },
  enableDD: {
    border: '2px dashed #25313b',
    color: '#25313b',
  },
  disableDD: {
    border: '2px dashed #b4bdc6',
    color: '#a8b0b8',
  },
  tpCard: {
  },
  tpMoreTxt: {
    padding: '0 0 0 60px',
  },
  tpLabel: {
    fontSize: 16,
  },
});

const msgDefault = 'Add spectra to compare.';

const tpHint = (classes) => (
  <span className={classNames(classes.tpCard)}>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Accept *.dx, *.jdx, *.JCAMP,
    </p>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Max 5 spectra.
    </p>
  </span>
);

const content = (classes, desc) => (
  <Tooltip
    title={tpHint(classes)}
    placement="bottom"
  >
    <span className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      { desc }
    </span>
  </Tooltip>
);

const inputOthers = (
  classes, jcampSt,
) => {
  const { selectedIdx, jcamps } = jcampSt;
  const selectedJcamp = jcamps[selectedIdx];
  const { addOthersCb } = selectedJcamp;

  const fileName = '';
  const desc = fileName || msgDefault;
  const onDrop = (jcampFiles) => {
    if (!addOthersCb) return;
    addOthersCb({ jcamps: jcampFiles });
  };

  return (
    <Dropzone
      className="dropbox"
      onDrop={onDrop}
    >
      {
        ({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={classNames(classes.baseDD)}
          >
            <input {...getInputProps()} />
            { content(classes, desc) }
          </div>
        )
      }
    </Dropzone>
  );
};

const compareList = (
  classes, jcampSt, rmOthersOneAct, toggleShowAct,
) => {
  const { selectedIdx, jcamps } = jcampSt;
  const selectedJcamp = jcamps[selectedIdx];
  const { others } = selectedJcamp;

  const rows = others.map((o, idx) => (
    {
      idx,
      title: o.spectra[0].title,
      color: Format.compareColors(idx),
      rmCb: () => rmOthersOneAct(idx),
      isShow: o.show,
      toggleShowCb: () => toggleShowAct(idx),
    }
  ));

  return (
    <Table className={classes.table}>
      <TableBody>
        {
          rows.map((row) => (
            <TableRow key={row.idx} className={classes.tRow} hover>
              <TableCell
                align="right"
                className={classNames(classes.tTxt, classes.square, 'txt-sv-panel-txt')}
                style={{ backgroundColor: row.color }}
              >
                { row.idx + 1 }
              </TableCell>
              <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt', row.isShow ? null : classes.tTxtHide)}>
                { row.title }
              </TableCell>
              <TableCell align="right" className={classNames(classes.tTxt, 'txt-sv-panel-txt')}>
                {
                  row.isShow
                    ? (
                      <VisibilityOutlinedIcon
                        onClick={row.toggleShowCb}
                        className={classes.showBtn}
                      />
                    )
                    : (
                      <VisibilityOffOutlinedIcon
                        onClick={row.toggleShowCb}
                        className={classes.hideBtn}
                      />
                    )
                }
                <HighlightOffIcon onClick={row.rmCb} className={classes.rmBtn} />
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};

const ComparePanel = ({
  classes, expand, onExapnd, jcampSt,
  rmOthersOneAct, toggleShowAct,
}) => (
  <Accordion
    expanded={expand}
    onChange={onExapnd}
    disableGutters
    sx={{
      '&.MuiAccordion-root.Mui-expanded': { margin: 0 },
      '&:before': { display: 'none' },
    }}
    TransitionProps={{ unmountOnExit: true }} // increase Accordion performance
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      className={classNames(classes.panelSummary)}
    >
      <Typography className="txt-panel-header">
        <span className={classNames(classes.txtBadge, 'txt-sv-panel-title')}>
          Spectra Comparisons
        </span>
      </Typography>
    </AccordionSummary>
    <Divider />
    { inputOthers(classes, jcampSt) }
    <div className={classNames(classes.panelDetail)}>
      {
        compareList(classes, jcampSt, rmOthersOneAct, toggleShowAct)
      }
    </div>
  </Accordion>
);

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    jcampSt: state.jcamp,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    rmOthersOneAct: rmOthersOne,
    toggleShowAct: toggleShow,
  }, dispatch)
);

ComparePanel.propTypes = {
  classes: PropTypes.object.isRequired,
  expand: PropTypes.bool.isRequired,
  onExapnd: PropTypes.func.isRequired,
  jcampSt: PropTypes.object.isRequired,
  rmOthersOneAct: PropTypes.func.isRequired,
  toggleShowAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styles)(ComparePanel));
