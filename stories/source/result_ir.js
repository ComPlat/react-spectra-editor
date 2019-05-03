const resultIr = {
  result: [
    {
      'c-,:C(-,:C)=O': {
        confidence: 85.11,
        status: 'accept',
      },
      'C-,:C(=O)-,:O-,:C': {
        confidence: 93.2,
        status: 'accept',
      },
      'c-,:[Cl]': {
        confidence: 87.30,
        status: 'reject',
      },
      'c-,:[N&+](=O)-,:[O&-]': {
        confidence: 93,
        status: 'reject',
      },
      'C-,:N-,:C(-,:C)=O': {
        confidence: 94.12345,
        status: 'accept',
      },
      'c,:O,:P(=S)(,:O,:C),:O,:C': {
        confidence: 0,
        status: 'unknown',
      },
    },
  ],
};

export default resultIr;
