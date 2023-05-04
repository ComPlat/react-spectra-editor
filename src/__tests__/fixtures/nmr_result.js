/* eslint-disable */
import nmrSvg from './nmr_svg';

const nmrResult = {
  outline: {
    code: 200,
    text: 'Load from files.',
  },
  output: {
    result: [
      {
        id: 1,
        type: 'nmr;13C;1d',
        svgs: [nmrSvg],
        statistics: {
          accept: 0,
          warning: 0,
          reject: 5,
          missing: 1,
          total: 6,
        },
        shifts: [
          {
            atom: 1,
            prediction: 135.5500030517578,
            real: 117.0,
            diff: 18.550003051757812,
            status: 'accept',
          },
          {
            atom: 3,
            prediction: 139.1999969482422,
            real: 123.0,
            diff: 16.199996948242188,
            status: 'warning',
          },
          {
            atom: 2,
            prediction: 121.5999984741211,
            real: 103.0,
            diff: 18.599998474121094,
            status: 'reject',
          },
          {
            atom: 3,
            prediction: 139.1999969482422,
            real: 123.0,
            diff: 16.199996948242188,
            status: 'reject',
          },
          {
            atom: 2,
            prediction: 121.5999984741211,
            real: 103.0,
            diff: 18.599998474121094,
            status: 'reject',
          },
          {
            atom: 4,
            prediction: 147.13500213623047,
            real: 0.0,
            diff: 0.0,
            status: 'missing',
          },
        ],
      },
    ],
  },
};

export default nmrResult;
