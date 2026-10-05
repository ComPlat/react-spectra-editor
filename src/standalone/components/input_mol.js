import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

import { addMolInit } from '../actions/action_mol';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  baseDD: {
    border: '2px dashed #000',
    borderRadius: 5,
    height: 30,
    lineHeight: '30px',
    margin: '0 0 10px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%',
  },
  tpCard: {
  },
  tpLabel: {
    fontSize: 16,
  },
});

const tpHint = classes => (
  <span className={classNames(classes.tpCard)}>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Accept *.mol
    </p>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Max 30Mb
    </p>
  </span>
);

const msgDefault = 'Add Molfile';

const showByMolfile = (molSt) => {
  const { src, mass } = molSt;
  if (src) {
    const txtMass = parseFloat(mass).toFixed(2);
    return `${src.name} (${txtMass}g/mol)`;
  }

  return msgDefault;
};

const content = (classes, desc) => (
  <Tooltip
    title={tpHint(classes)}
    placement="bottom"
  >
    <span>{desc}</span>
  </Tooltip>
);

const InputMol = ({
  classes, molSt, addMolInitAct,
}) => {
  const onDrop = mols => addMolInitAct({ mol: mols[0] });

  const desc = showByMolfile(molSt, classes);

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

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    molSt: state.mol,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addMolInitAct: addMolInit,
  }, dispatch)
);

InputMol.propTypes = {
  classes: PropTypes.object.isRequired,
  molSt: PropTypes.object.isRequired,
  addMolInitAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(InputMol));
