const VerifyJcampExt = (file) => {
  const filename = file && file.name;
  if (!filename) return false;
  const last = filename.split('.').length - 1;
  const ext = filename.split('.')[last];
  const acceptables = ['jdx', 'dx', 'jcamp', 'zip'];
  return acceptables.indexOf(ext.toLowerCase()) >= 0;
};


const VerifyMsExt = (file) => {
  const filename = file && file.name;
  if (!filename) return false;
  const last = filename.split('.').length - 1;
  const ext = filename.split('.')[last];
  const acceptables = ['raw', 'mzml', 'mzxml', 'cdf'];
  return acceptables.indexOf(ext.toLowerCase()) >= 0;
};


const VerifyMolExt = (mol) => {
  const molName = mol && mol.name;
  if (!molName) return false;
  const last = molName.split('.').length - 1;
  const ext = molName.split('.')[last];
  return ext.toLowerCase() === 'mol';
};


const kb = 1024;
const mb = 1024 * kb;
const sizeLimit = 30 * mb;

const VerifySize = (file) => {
  const filesize = file && file.size;
  if (!filesize) return false;

  return filesize <= sizeLimit;
};


export {
  VerifyJcampExt, VerifyMsExt, VerifyMolExt, VerifySize,
};
