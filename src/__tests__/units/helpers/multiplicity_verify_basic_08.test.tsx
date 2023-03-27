import { verifyTypeO } from '../../../helpers/multiplicity_verify_basic';

const deltaX = 0.0003;
const observeFrequency = 400;

describe('Multiplicity', () => {
  describe('Type O', () => {
    const type = 'o';
    const js = [10 * deltaX * observeFrequency];
    const metaSt = {
      peaks: {
        deltaX,
        observeFrequency,
      },
    };

    describe('has < 7 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv, rfv, rfv];
        const output = verifyTypeO(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has > 7 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv, rfv, rfv, rfv, rfv];
        const output = verifyTypeO(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has = 7 intervals', () => {
      describe('~ 5 * deltaX', () => {
        const rfv = 5 * deltaX;

        describe('< tolerance', () => {
          test('return o', () => {
            const iv = rfv - 2.1 * deltaX;
            const oivs = [rfv, iv, iv, iv, iv, iv, iv];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('o');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return ddd (case 1)', () => {
            const iv1 = rfv - 2.1 * deltaX;
            const iv2 = iv1 - 2.2 * deltaX;
            const iv3 = iv2 - 2.2 * deltaX;
            const oivs = [rfv, iv2, iv1, iv3, iv1, iv2, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('ddd');
            expect(output.js.length).toEqual(3);
          });
          test('return ddd (case 2)', () => {
            const iv1 = rfv - 2.1 * deltaX;
            const iv1h = iv1 / 2;
            const iv2 = iv1 - 2.2 * deltaX;
            const oivs = [rfv, iv2, iv1h, iv1h, iv1h, iv2, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('ddd');
            expect(output.js.length).toEqual(3);
          });
          test('return dq (case 1)', () => {
            const iv1 = rfv - 2.1 * deltaX;
            const iv1h = iv1 / 2;
            const oivs = [rfv, iv1h, iv1h, iv1h, iv1h, iv1h, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('dq');
            expect(output.js.length).toEqual(2);
          });
          test('return dq (case 2)', () => {
            const iv1 = rfv - 2.1 * deltaX;
            const iv2 = iv1 - 2.3 * deltaX;
            const oivs = [rfv, iv1, iv1, iv2, iv1, iv1, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('dq');
            expect(output.js.length).toEqual(2);
          });
          test('return qd', () => {
            const iv1 = rfv - 2.1 * deltaX;
            const iv2 = iv1 - 2.2 * deltaX;
            const oivs = [rfv, iv2, iv1, iv2, iv1, iv2, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('qd');
            expect(output.js.length).toEqual(2);
          });
          test('return m', () => {
            const iv = rfv - 2.2 * deltaX;
            const oivs = [rfv, iv, iv, iv];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });

      describe('~ 50 * deltaX', () => {
        const rfv = 50 * deltaX;

        describe('< tolerance', () => {
          test('return o', () => {
            const iv = rfv * 0.84;
            const oivs = [rfv, iv, iv, iv, iv, iv, iv];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('o');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return ddd (case 1)', () => {
            const iv1 = rfv * 0.84;
            const iv2 = iv1 * 0.80;
            const iv3 = iv2 * 0.70;
            const oivs = [rfv, iv2, iv1, iv3, iv1, iv2, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('ddd');
            expect(output.js.length).toEqual(3);
          });
          test('return ddd (case 2)', () => {
            const iv1 = rfv * 0.84;
            const iv1h = iv1 / 2;
            const iv2 = iv1 * 0.9;
            const oivs = [rfv, iv2, iv1h, iv1h, iv1h, iv2, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('ddd');
            expect(output.js.length).toEqual(3);
          });
          test('return dq (case 1)', () => {
            const iv1 = rfv * 0.84;
            const iv1h = iv1 / 2;
            const oivs = [rfv, iv1h, iv1h, iv1h, iv1h, iv1h, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('dq');
            expect(output.js.length).toEqual(2);
          });
          test('return dq (case 2)', () => {
            const iv1 = rfv * 0.84;
            const iv2 = iv1 * 0.80;
            const oivs = [rfv, iv1, iv1, iv2, iv1, iv1, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('dq');
            expect(output.js.length).toEqual(2);
          });
          test('return qd', () => {
            const iv1 = rfv * 0.84;
            const iv2 = iv1 * 0.83;
            const oivs = [rfv, iv2, iv1, iv2, iv1, iv2, iv1];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('qd');
            expect(output.js.length).toEqual(2);
          });
          test('return m', () => {
            const iv = rfv * 0.84;
            const oivs = [rfv, iv, iv, iv];
            const output = verifyTypeO(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });
    });
  });
});
