import { LIST_LAYOUT } from "../../../constants/list_layout";
import { extractParams } from "../../../helpers/extractParams";

describe('Test extract parameters helper', () => {
  describe('MS layout', () => {
    const msEntity = {
      layout: LIST_LAYOUT.MS,
      features: {
        autoPeak: {
          scanAutoTarget: 2,
          data: [{ x: [1], y: [10] }],
          origin: 'auto',
        },
        editPeak: {
          scanEditTarget: 1,
          data: [{ x: [2], y: [20] }],
          origin: 'edit',
        },
        integration: [{ id: 1 }],
        multiplicity: [{ id: 2 }],
      },
      spectra: [
        { data: [{ x: [100], y: [1000] }] },
        { data: [{ x: [200], y: [2000] }] },
      ],
    };

    it('uses selected scan spectrum and auto feature when threshold is not edited', () => {
      const params: any = extractParams(
        msEntity as any,
        { isEdit: false } as any,
        { target: 2, isAuto: true } as any,
      );
      expect(params.topic).toEqual({ x: [200], y: [2000] });
      expect(params.feature.origin).toEqual('auto');
      expect(params.hasEdit).toEqual(true);
    });

    it('prefers edit feature when threshold is edited and edit data exists', () => {
      const params: any = extractParams(
        msEntity as any,
        { isEdit: true } as any,
        { target: null, isAuto: false } as any,
      );
      expect(params.topic).toEqual({ x: [100], y: [1000] });
      expect(params.feature.origin).toEqual('edit');
      expect(params.hasEdit).toEqual(true);
    });

    it('supports forceLcms option even on MS layout', () => {
      const params: any = extractParams(
        msEntity as any,
        { isEdit: false } as any,
        { target: 1, isAuto: true } as any,
        { forceLcms: true } as any,
      );
      expect(params.entity.layout).toEqual(LIST_LAYOUT.MS);
      expect(params.topic).toEqual({ x: [undefined, undefined], y: [10, 20] });
      expect(params.feature.operation.layout).toEqual(LIST_LAYOUT.MS);
    });
  });

  describe('LC/MS layout', () => {
    it('extracts TIC x/y directly from first valid spectrum', () => {
      const lcmsEntity = {
        layout: LIST_LAYOUT.LC_MS,
        csCategory: ['tic', 'positive'],
        features: [
          { data: [{ x: [1, 2], y: [11, 22] }] },
        ],
        spectra: [{ data: [{ x: [0], y: [0] }] }],
      };

      const params: any = extractParams(
        lcmsEntity as any,
        { isEdit: false } as any,
        { target: 1, isAuto: true } as any,
      );
      expect(params.topic).toEqual({ x: [1, 2], y: [11, 22] });
      expect(params.feature.maxY).toEqual(22);
      expect(params.feature.operation.layout).toEqual(LIST_LAYOUT.LC_MS);
    });

    it('extracts UVVIS/MZ profile from pageValue and max y per feature', () => {
      const lcmsEntity = {
        layout: LIST_LAYOUT.LC_MS,
        csCategory: ['uvvis'],
        features: [
          { pageValue: 210, data: [{ x: [1], y: [3, 9, 4] }] },
          { pageValue: 220, data: [{ x: [2], y: [8, 1, 7] }] },
        ],
        spectra: [{ data: [{ x: [0], y: [0] }] }],
      };

      const params: any = extractParams(
        lcmsEntity as any,
        { isEdit: false } as any,
        { target: 1, isAuto: true } as any,
      );
      expect(params.topic).toEqual({ x: [210, 220], y: [9, 8] });
      expect(params.feature.maxY).toEqual(9);
    });
  });
});