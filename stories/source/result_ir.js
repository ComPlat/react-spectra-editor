const resultIr = {
  result: [
    {
      'C-,:O': {
        confidence: 85,
        status: 'accept',
      },
      'C-,:C(=O)-,:O-,:C': {
        confidence: 93,
        status: 'accept',
      },
      'c-,:[Cl]': {
        confidence: 87,
        status: 'reject',
      },
      'c-,:[N&+](=O)-,:[O&-]': {
        confidence: 93,
        status: 'reject',
      },
      'c-,:F': {
        confidence: 94,
        status: 'accept',
      },
      CBB: {
        confidence: 0,
        status: 'unknown',
      },
    },
  ],
};

export default resultIr;
