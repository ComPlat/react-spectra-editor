import Format from './format';

const btnCmdAnaViewer = layoutSt => Format.isMsLayout(layoutSt);

const hideCmdAnaViewer = () => false;

const btnCmdAddPeak = () => false;

const btnCmdRmPeak = () => false;

const btnCmdSetRef = layoutSt => !Format.isNmrLayout(layoutSt);

const btnCmdIntg = layoutSt => !Format.isNmrLayout(layoutSt);

const btnCmdMpy = layoutSt => !Format.isNmrLayout(layoutSt);

const btnCmdMpyPeak = (layoutSt, mpySt) => {
  const { smExtext } = mpySt;
  return btnCmdMpy(layoutSt) || !smExtext;
};

const hideCmdThres = layoutSt => Format.isMsLayout(layoutSt);

const btnCmdThres = thresVal => !thresVal;

// const hidePanelPeak = layoutSt => Format.isMsLayout(layoutSt);
const hidePanelPeak = layoutSt => true;  // eslint-disable-line

const hidePanelMpy = layoutSt => !Format.isNmrLayout(layoutSt);

const hideSolvent = layoutSt => !Format.isNmrLayout(layoutSt);

const Config = {
  btnCmdAnaViewer,
  hideCmdAnaViewer,
  btnCmdAddPeak,
  btnCmdRmPeak,
  btnCmdSetRef,
  btnCmdIntg,
  btnCmdMpy,
  btnCmdMpyPeak,
  hideCmdThres,
  btnCmdThres,
  hidePanelPeak,
  hidePanelMpy,
  hideSolvent,
};

export default Config;