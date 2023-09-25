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
        LIST_LAYOUT.MS, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
        LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, LIST_LAYOUT.HPLC_UVVIS,
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
    const mpySt = {"selectedIdx":0,"multiplicities":[{"stack":[{"js":[1.7728561010112571],"mpyType":"quint","xExtent":{"xL":6.18942577177587,"xU":6.559753568068116},"yExtent":{"yL":20286604,"yU":61276677},"peaks":[{"x":6.422977415781519,"y":20286604},{"x":6.418393960239213,"y":44041878},{"x":6.4138105046969045,"y":61276677},{"x":6.409227049154596,"y":44393311},{"x":6.404949157315109,"y":21143741}]},{"js":[0.6724626590039406,2.0173879770127314,37.41337702824512],"mpyType":"ddd","xExtent":{"xL":7.788569415813955,"xU":8.31039593286588},"yExtent":{"yL":3675585,"yU":4004335},"peaks":[{"x":8.101133271671815,"y":3689696},{"x":8.099605453157713,"y":3869072},{"x":8.095938688723866,"y":3880744},{"x":8.094410870209764,"y":3675585},{"x":8.007630778608736,"y":3706408},{"x":8.005797396391813,"y":4004335},{"x":8.002741759363607,"y":3915159},{"x":8.000908377146684,"y":3706677}]},{"js":[],"mpyType":"s","xExtent":{"xL":14.706972135774421,"xU":15.195132390935767},"yExtent":{"yL":16276328,"yU":16276328},"peaks":[{"x":14.948510288176845,"y":16276328}]},{"peaks":[{"x":11.440944543500096,"y":26450300},{"x":11.420777339113942,"y":28797799},{"x":11.298857421688554,"y":34032080},{"x":11.280523599519324,"y":24725861},{"x":11.27838465359958,"y":40013064},{"x":11.190687870890091,"y":37931375},{"x":11.184576596833681,"y":38611682},{"x":11.028739108395214,"y":14764010},{"x":11.02568347136701,"y":15806310},{"x":11.011016413631625,"y":22918651},{"x":11.00826634030624,"y":31715857},{"x":11.005821830683676,"y":16826172},{"x":10.990849209245471,"y":19172963},{"x":10.988099135920086,"y":18223303},{"x":10.904069117644443,"y":35864429}],"xExtent":{"xL":8.630543435939886,"xU":12.328690131870278},"yExtent":{"yL":-16852818.03512673,"yU":72852232.91555789},"mpyType":"m","js":[]}],"shift":0,"smExtext":{"xL":8.630543435939886,"xU":12.328690131870278}}]}

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
        const isShow = Config.btnCmdMpyPeak(layout, mpySt, 0)
        expect(isShow).toEqual(true)
      })
    })

    it('Hide add and remove multiplicity peak button', () => {
      layoutShouldView.forEach(layout => {
        const isShow = Config.btnCmdMpyPeak(layout, mpySt, 0)
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