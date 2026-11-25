/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

import { dropBox, hint } from './styles';

import { addMolInit } from '../actions/action_mol';

const styles = () => ({
  baseDD: dropBox,
  hint,
});

const tpHint = (classes) => (
  <ul className={classNames(classes.hint, 'txt-sv-tp')}>
    <li>*.mol</li>
    <li>up to 200 MB</li>
  </ul>
);

const msgDefault = 'Add Molfile';

const showByMolfile = (molSt) => {
  const { src, mass } = molSt;
  if (src) {
    const txtMass = parseFloat(mass).toFixed(2);
    return `${src.name} (${txtMass} g/mol)`;
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

function InputMol({
  classes, molSt, addMolInitAct,
}) {
  const onDrop = (mols) => addMolInitAct({ mol: mols[0] });

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
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    molSt: state.mol,
  }
);

const mapDispatchToProps = (dispatch) => (
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
