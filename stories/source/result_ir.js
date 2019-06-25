import svgIr from './svg_ir';

const resultIr = {
  outline: {
    code: 200,
    text: 'Load from files.',
  },
  output: {
    result: [
      {
        type: 'ir',
        svgs: [svgIr],
        fgs: [
          {
            sma: 'c-,:C(-,:C)=O',
            confidence: 85.11,
            status: 'accept',
          },
          {
            sma: 'C-,:C(=O)-,:O-,:C',
            confidence: 93.2,
            status: 'accept',
          },
          {
            sma: 'c-,:[Cl]',
            confidence: 87.30,
            status: 'reject',
          },
          {
            sma: 'c-,:[N&+](=O)-,:[O&-]',
            confidence: 93,
            status: 'reject',
          },
          {
            sma: 'C-,:N-,:C(-,:C)=O',
            confidence: 94.12345,
            status: 'accept',
          },
          {
            sma: 'c,:O,:P(=S)(,:O,:C),:O,:C',
            confidence: 0,
            status: 'unknown',
          },
        ],
      },
    ],
  },
};

export default resultIr;
