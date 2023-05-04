import Config from "../../../helpers/cfg"
import { LIST_LAYOUT } from "../../../constants/list_layout";

describe('Test Config helper', () => {
  let layoutShouldView: String[]
  let layoutShouldHide: String[]

  describe('Analytical view button', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.IR, LIST_LAYOUT.C13, LIST_LAYOUT.H1]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS,
        LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29, LIST_LAYOUT.MS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]
    })

    it('Show analytical view button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = !Config.btnCmdAnaViewer(layout)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide analytical view button', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = !Config.btnCmdAnaViewer(layout)
        expect(isShow).toEqual(false)
      })

      expect(Config.hideCmdAnaViewer()).toEqual(false)
    })
  })

  describe('Add and remove peaks button', () => {
    beforeEach(()=> {
      layoutShouldHide = [LIST_LAYOUT.MS]
      layoutShouldView = [LIST_LAYOUT.IR, LIST_LAYOUT.C13, LIST_LAYOUT.H1,
        LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS,
        LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]
    })

    it('Show add peaks button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = !Config.btnCmdAddPeak(layout)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide add peaks button', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = !Config.btnCmdAddPeak(layout)
        expect(isShow).toEqual(false)
      })
    })

    it('Show remove peaks button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = !Config.btnCmdRmPeak(layout)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide remove peaks button', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = !Config.btnCmdRmPeak(layout)
        expect(isShow).toEqual(false)
      })
    })
  })

  describe('Set ref button', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.MS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]
    })

    it('Show set ref button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = !Config.btnCmdSetRef(layout)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide set ref button', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = !Config.btnCmdSetRef(layout)
        expect(isShow).toEqual(false)
      })
    })
  })

  describe('Add and remove multiplicity button', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.MS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]
    })

    it('Show add and remove multiplicity button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = !Config.btnCmdMpy(layout)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide add and remove multiplicity button', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = !Config.btnCmdMpy(layout)
        expect(isShow).toEqual(false)
      })
    })
  })

  describe('Add and remove integration button', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29, LIST_LAYOUT.HPLC_UVVIS]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.MS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]
    })

    it('Show add and remove integration button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = !Config.btnCmdIntg(layout)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide add and remove integration button', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = !Config.btnCmdIntg(layout)
        expect(isShow).toEqual(false)
      })
    })
  })

  describe('Add and remove multiplicity peak button', () => {
    const mpySt = {smExtext: true}

    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.MS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]
    })

    it('Show add and remove multiplicity peak button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = Config.btnCmdMpyPeak(layout, {})
        expect(isShow).toEqual(true)
      })
    })

    it('Show add and remove multiplicity peak button when wrong layout but has smsExtent value', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = Config.btnCmdMpyPeak(layout, mpySt)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide add and remove multiplicity peak button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = Config.btnCmdMpyPeak(layout, mpySt)
        expect(isShow).toEqual(false)
      })
    })
  })

  describe('Threshold line', () => {
    beforeEach(()=> {
      layoutShouldHide = [LIST_LAYOUT.MS]
      layoutShouldView = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29, LIST_LAYOUT.HPLC_UVVIS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]
    })

    it('Show threshold line', () => {
      layoutShouldView.forEach(layout => {
        const isHide = Config.hideCmdThres(layout)
        expect(isHide).toEqual(false)
      })
    })

    it('Hide threshold line', () => {
      layoutShouldHide.forEach(layout => {
        const isHide = Config.hideCmdThres(layout)
        expect(isHide).toEqual(true)
      })
    })
  })

  describe('Threshold button', () => {
    it('Show threshold button', () => {
      const isHide = Config.btnCmdThres(10)
      expect(isHide).toEqual(false)
    })

    it('Hide threshold button', () => {
      const isHide = Config.btnCmdThres(0)
      expect(isHide).toEqual(true)
    })
  })

  describe('Panel peaks info view', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.SEC]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29, LIST_LAYOUT.HPLC_UVVIS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.MS]
    })

    it('Show panel peaks info view', () => {
      layoutShouldView.forEach(layout => {
        const isHide = Config.hidePanelPeak(layout)
        expect(isHide).toEqual(false)
      })
    })

    it('Hide panel peaks info view', () => {
      layoutShouldHide.forEach(layout => {
        const isHide = Config.hidePanelPeak(layout)
        expect(isHide).toEqual(true)
      })
    })
  })

  describe('Panel multiplicity info view', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.SEC, LIST_LAYOUT.HPLC_UVVIS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.MS]
    })

    it('Show multiplicity info view', () => {
      layoutShouldView.forEach(layout => {
        const isHide = Config.hidePanelMpy(layout)
        expect(isHide).toEqual(false)
      })
    })

    it('Hide multiplicity info view', () => {
      layoutShouldHide.forEach(layout => {
        const isHide = Config.hidePanelMpy(layout)
        expect(isHide).toEqual(true)
      })
    })
  })

  describe('Solvent info view', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29]
      layoutShouldHide = [LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.SEC, LIST_LAYOUT.HPLC_UVVIS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.MS]
    })

    it('Show solvent info view', () => {
      layoutShouldView.forEach(layout => {
        const isHide = Config.hideSolvent(layout)
        expect(isHide).toEqual(false)
      })
    })

    it('Hide solvent info view', () => {
      layoutShouldHide.forEach(layout => {
        const isHide = Config.hideSolvent(layout)
        expect(isHide).toEqual(true)
      })
    })
  })

  describe('Panel comparison info view', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.IR, LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.XRD]
      layoutShouldHide = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29,
        LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS,
        LIST_LAYOUT.SEC,
        LIST_LAYOUT.TGA, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.CDS, LIST_LAYOUT.MS]
    })

    it('Show comparison info view', () => {
      layoutShouldView.forEach(layout => {
        const isHide = Config.hidePanelCompare(layout)
        expect(isHide).toEqual(false)
      })
    })

    it('Hide comparison info view', () => {
      layoutShouldHide.forEach(layout => {
        const isHide = Config.hidePanelCompare(layout)
        expect(isHide).toEqual(true)
      })
    })
  })

  describe('Show two threshold view', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.CYCLIC_VOLTAMMETRY]
      layoutShouldHide = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29,
        LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.SEC, LIST_LAYOUT.HPLC_UVVIS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD,
        LIST_LAYOUT.CDS, LIST_LAYOUT.MS]
    })

    it('Show two thresholdview', () => {
      layoutShouldView.forEach(layout => {
        const isShow = Config.showTwoThreshold(layout)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide two threshold view', () => {
      layoutShouldHide.forEach(layout => {
        const isShow = Config.showTwoThreshold(layout)
        expect(isShow).toEqual(false)
      })
    })
  })

  describe('Panel cyclic voltammetry info view', () => {
    beforeEach(()=> {
      layoutShouldView = [LIST_LAYOUT.CYCLIC_VOLTAMMETRY]
      layoutShouldHide = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29,
        LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, LIST_LAYOUT.IR,
        LIST_LAYOUT.SEC, LIST_LAYOUT.HPLC_UVVIS,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD,
        LIST_LAYOUT.CDS, LIST_LAYOUT.MS]
    })

    it('Show cyclic voltammetry thresholdview', () => {
      layoutShouldView.forEach(layout => {
        const isHide = Config.hidePanelCyclicVolta(layout)
        expect(isHide).toEqual(false)
      })
    })

    it('Hide cyclic voltammetry threshold view', () => {
      layoutShouldHide.forEach(layout => {
        const isHide = Config.hidePanelCyclicVolta(layout)
        expect(isHide).toEqual(true)
      })
    })
  })
})