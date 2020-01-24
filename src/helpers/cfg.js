import Format from './format';

const btnCmdAnaViewer = layoutSt => Format.isMsLayout(layoutSt);

const hideCmdAnaViewer = () => false;

const btnCmdAddPeak = layoutSt => Format.isMsLayout(layoutSt);

const btnCmdRmPeak = layoutSt => Format.isMsLayout(layoutSt);

const btnCmdSetRef = layoutSt => !Format.isNmrLayout(layoutSt);

const btnCmdIntg = layoutSt => !Format.is1HLayout(layoutSt);

const btnCmdMpy = layoutSt => !Format.isNmrLayout(layoutSt);

const btnCmdMpyPeak = (layoutSt, mpySt) => {
  const { smExtext } = mpySt;
  return btnCmdMpy(layoutSt) || !smExtext;
};

const hideCmdThres = layoutSt => Format.isMsLayout(layoutSt);

const btnCmdThres = thresVal => !thresVal;

const hidePanelPeak = layoutSt => Format.isMsLayout(layoutSt);

const hidePanelMpy = layoutSt => !Format.isNmrLayout(layoutSt);

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
};

export default Config;
