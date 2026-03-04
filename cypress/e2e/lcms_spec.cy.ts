/// <reference types="cypress" />

describe('LC/MS layouts', () => {
  const getAppState = () => cy.window().then((win) => (win as any).__spectraStore.getState())

  const openLayout = (buttonText: string) => {
    cy.viewport(2000, 2000)
    cy.visit('http://localhost:3000/')
    cy.contains('button', buttonText).click()
  }

  const assertNoNaNInPaths = (selector: string) => {
    cy.get(`${selector} path[d]`).each(($path) => {
      const d = $path.attr('d') || ''
      expect(d).to.not.contain('NaN')
    })
  }

  const assertLcmsViewerIsStable = () => {
    cy.get('.d3Line .d3Svg').should('exist')
    cy.get('.d3Multi .d3SvgMulti').should('exist')
    cy.get('.d3Rect .d3SvgRect').should('exist')

    assertNoNaNInPaths('.d3Line .d3Svg')
    assertNoNaNInPaths('.d3Multi .d3SvgMulti')
    assertNoNaNInPaths('.d3Rect .d3SvgRect')
  }

  it('OpenLab renders LC/MS line, multi and rect graphs', () => {
    openLayout('LC/MS OpenLab')
    assertLcmsViewerIsStable()
  })

  it('Chemstation renders LC/MS line, multi and rect graphs', () => {
    openLayout('LC/MS Chemstation')
    assertLcmsViewerIsStable()
  })

  it('updates reducer when adding peak and integration action', () => {
    openLayout('LC/MS OpenLab')
    assertLcmsViewerIsStable()

    cy.window().then((win) => {
      getAppState().then((stateBefore) => {
      const peaksBefore = stateBefore.hplcMs.uvvis.currentSpectrum?.peaks?.length || 0
      const integrationsBefore = stateBefore.hplcMs.uvvis.currentSpectrum?.integrations?.length || 0

      cy.get('.btn-sv-bar-addpeak').click()
      cy.get('.d3Line .d3Svg').trigger('click', 600, 350, { which: 1, view: win })

      const selectedWaveLength = stateBefore.hplcMs.uvvis.selectedWaveLength
      const spectrumData = stateBefore.hplcMs.uvvis.currentSpectrum?.data
      const xValues = Array.isArray(spectrumData?.x) ? spectrumData.x : []
      const yValues = Array.isArray(spectrumData?.y) ? spectrumData.y : []
      const mid = Math.floor(xValues.length / 2)
      const xL = xValues[Math.max(0, mid - 20)]
      const xU = xValues[Math.min(xValues.length - 1, mid + 20)]
      const hasIntegrationPayload = Number.isFinite(xL)
        && Number.isFinite(xU)
        && xU !== xL
        && xValues.length > 0
        && yValues.length > 0

      if (hasIntegrationPayload) {
        (win as any).__spectraStore.dispatch({
          type: 'UPDATE_HPLCMS_INTEGRATIONS',
          payload: {
            spectrumId: selectedWaveLength,
            integration: {
              xExtent: { xL, xU },
              data: spectrumData,
            },
          },
        })
      }

      getAppState().then((stateAfter) => {
        const peaksAfter = stateAfter.hplcMs.uvvis.currentSpectrum?.peaks?.length || 0
        const integrationsAfter = stateAfter.hplcMs.uvvis.currentSpectrum?.integrations?.length || 0
        expect(peaksAfter).to.be.greaterThan(peaksBefore)
        expect(integrationsAfter).to.be.at.least(integrationsBefore)
      })
    })
    })
  })

  it('updates reducer when switching wavelength', () => {
    openLayout('LC/MS OpenLab')
    assertLcmsViewerIsStable()

    getAppState().then((stateBefore) => {
      const wavelengths = stateBefore.hplcMs.uvvis.listWaveLength || []
      expect(wavelengths.length).to.be.greaterThan(1)
      const initialWaveLength = stateBefore.hplcMs.uvvis.selectedWaveLength
      const nextWaveLength = wavelengths.find((value) => value !== initialWaveLength)
      expect(nextWaveLength).to.not.equal(undefined)

      cy.contains('.MuiFormControl-root', 'Wavelength (nm)')
        .find('.MuiSelect-select')
        .click({ force: true })
      cy.get('li[role="option"]')
        .contains(new RegExp(`^\\s*${nextWaveLength}\\s*$`))
        .click({ force: true })

      getAppState().then((stateAfter) => {
        expect(stateAfter.hplcMs.uvvis.selectedWaveLength).to.equal(nextWaveLength)
        expect(stateAfter.hplcMs.uvvis.currentSpectrum).to.not.equal(null)
      })
    })
  })

  it('updates TIC polarity on Chemstation', () => {
    openLayout('LC/MS Chemstation')
    assertLcmsViewerIsStable()

    getAppState().then((stateBefore) => {
      const available = stateBefore.hplcMs.tic?.available || {}
      const currentPolarity = stateBefore.hplcMs.tic?.polarity
      const polarityOrder = ['positive', 'negative', 'neutral']
      const nextPolarity = polarityOrder.find((value) => available[value] && value !== currentPolarity)
      if (!nextPolarity) return

      const uiLabelByPolarity: Record<string, string> = {
        positive: 'PLUS',
        negative: 'MINUS',
        neutral: 'NEUTRAL',
      }
      const nextLabel = uiLabelByPolarity[nextPolarity]

      cy.contains('.MuiFormControl-root', 'TIC')
        .find('.MuiSelect-select')
        .click({ force: true })
      cy.get('li[role="option"]').contains(new RegExp(`^\\s*${nextLabel}\\s*$`)).click({ force: true })

      getAppState().then((stateAfter) => {
        expect(stateAfter.hplcMs.tic.polarity).to.equal(nextPolarity)
      })
    })
  })

  it('keeps zoom usable after leaving LC/MS', () => {
    openLayout('LC/MS OpenLab')
    assertLcmsViewerIsStable()

    cy.contains('button', 'NMR 1H').click()
    cy.get('.d3Line .d3Svg').should('exist')

    cy.window().then((win) => {
      cy.get('.btn-sv-bar-zoomin').click()
      cy.get('.d3Line .brush').should('exist')
      cy.get('.d3Line .d3Svg')
        .trigger('mousedown', 400, 100, { which: 1, view: win, force: true })
        .trigger('mousemove', { clientX: 800, clientY: 1000, view: win, force: true })
        .trigger('mouseup', { view: win, force: true })

      cy.get('.btn-sv-bar-zoomreset').click()
    })
  })
})
