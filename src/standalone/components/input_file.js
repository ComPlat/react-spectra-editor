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

import { addFileInit } from '../actions/action_file';

const styles = () => ({
  baseDD: dropBox,
  hint,
});

const tpHint = (classes) => (
  <ul className={classNames(classes.hint, 'txt-sv-tp')}>
    <li>*.dx, *.jdx, *.JCAMP, *.RAW, *.mz(X)ML, *.cdf</li>
    <li>*.zip (Bruker FID folder)</li>
    <li>up to 200 MB</li>
  </ul>
);

const msgDefault = 'Add Spectrum';

const content = (classes, desc) => (
  <Tooltip
    title={tpHint(classes)}
    placement="bottom"
  >
    <span>{desc}</span>
  </Tooltip>
);

function InputFile({
  classes, srcFileSt, addFileInitAct,
}) {
  const fileName = srcFileSt && srcFileSt.name;
  const onDrop = (files) => addFileInitAct({ file: files[0] });
  const desc = fileName || msgDefault;

  return (
    <Dropzone
      className="dropbox"
      onDrop={onDrop}
      disabled={false}
    >
      {
        ({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={classes.baseDD}
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
    srcFileSt: state.file.src,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    addFileInitAct: addFileInit,
  }, dispatch)
);

InputFile.propTypes = {
  classes: PropTypes.object.isRequired,
  srcFileSt: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  addFileInitAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(InputFile));
