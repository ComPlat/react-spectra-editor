const getArea = (xL, xU, data) => {
  let [iL, iU] = [data.length - 1, 0];

  for (let i = 0; i < data.length; i += 1) {
    const pt = data[i];
    if (xL <= pt.x && pt.x <= xU) {
      if (iL > i) { iL = i; }
      if (i > iU) { iU = i; }
    }
  }
  return Math.abs(data[iU].k - data[iL].k);
};

export { getArea };  // eslint-disable-line
