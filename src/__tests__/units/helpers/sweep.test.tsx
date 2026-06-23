import { buildSweepPayloadFromXBounds } from "../../../helpers/sweep";

describe('Test helper for sweep payloads', () => {
  const data = [{ x: 0, y: 1, k: 0 }, { x: 2, y: 2, k: 1 }];
  const dataPks = [{ x: 1, y: 2 }];

  it('builds the same integration sweep shape from two x bounds', () => {
    const focus = {
      data,
      dataPks,
      currentExtent: {
        yExtent: { yL: -1, yU: 3 },
      },
    };

    const payload = buildSweepPayloadFromXBounds(focus, 2, 0);

    expect(payload).toEqual({
      xExtent: { xL: 0, xU: 2 },
      yExtent: { yL: -1, yU: 3 },
      data,
      dataPks,
    });
  });

  it('accepts zero as a valid lower x bound', () => {
    const focus = {
      data,
      dataPks,
      h: 10,
      scales: {
        y: {
          invert: (value) => value,
        },
      },
    };

    const payload = buildSweepPayloadFromXBounds(focus, 0, 1);

    expect(payload.xExtent).toEqual({ xL: 0, xU: 1 });
  });
});
