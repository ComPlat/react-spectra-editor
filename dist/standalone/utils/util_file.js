"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifySize = exports.VerifyMsExt = exports.VerifyMolExt = exports.VerifyJcampExt = void 0;
const VerifyJcampExt = file => {
  const filename = file && file.name;
  if (!filename) return false;
  const last = filename.split('.').length - 1;
  const ext = filename.split('.')[last];
  const acceptables = ['jdx', 'dx', 'jcamp', 'zip'];
  return acceptables.indexOf(ext.toLowerCase()) >= 0;
};
exports.VerifyJcampExt = VerifyJcampExt;
const VerifyMsExt = file => {
  const filename = file && file.name;
  if (!filename) return false;
  const last = filename.split('.').length - 1;
  const ext = filename.split('.')[last];
  const acceptables = ['raw', 'mzml', 'mzxml', 'cdf'];
  return acceptables.indexOf(ext.toLowerCase()) >= 0;
};
exports.VerifyMsExt = VerifyMsExt;
const VerifyMolExt = mol => {
  const molName = mol && mol.name;
  if (!molName) return false;
  const last = molName.split('.').length - 1;
  const ext = molName.split('.')[last];
  return ext.toLowerCase() === 'mol';
};
exports.VerifyMolExt = VerifyMolExt;
const kb = 1024;
const mb = 1024 * kb;
const sizeLimit = 30 * mb;
const VerifySize = file => {
  const filesize = file && file.size;
  if (!filesize) return false;
  return filesize <= sizeLimit;
};
exports.VerifySize = VerifySize;