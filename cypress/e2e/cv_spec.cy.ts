describe('CV', () => {
  beforeEach(() => {
    cy.viewport(2000, 2000)
    cy.visit('http://localhost:3000/')
    cy.get('#btn-cv').click({ force: true })
  })

  it('Open layout', () => {
    cy.get('.d3Line').children().should('have.class', 'd3Svg')
    cy.get('.d3Svg text.xLabel').should('have.text', 'V vs Ref')
    cy.get('.d3Svg text.yLabel').should('have.text', 'A')
  })

  // Click x is a fraction of the chart's rendered width, not a pixel, so a change to the
  // chart column's width cannot move a click off its target (or off the chart) unnoticed.
  // The fractions are the original coordinates over the chart's width at this viewport
  // when it filled a 9/12 column (1440px).
  const X_MAX_PEAK = 1110 / 1440
  const X_MIN_PEAK = 1050 / 1440
  const X_PECKER = 1350 / 1440

  function clickChart(fraction, y, offset, view) {
    cy.get('.d3Svg').scrollIntoView()
    cy.get('.d3Svg').then(($svg) => {
      const x = fraction * $svg[0].getBoundingClientRect().width + offset
      cy.wrap($svg).trigger('click', x, y, {
        which: 1,
        view: view,
      })
    })
  }

  function addMaxPeak(view, offset=0) {
    cy.get('.btn-sv-bar-addpeak').click()
    clickChart(X_MAX_PEAK, 480, offset, view)
  }

  function addMinPeak(view, offset=0) {
    cy.get('.btn-sv-bar-addpeak').click()
    clickChart(X_MIN_PEAK, 750, offset, view)
  }

  function addPecker(view, offset=0) {
    cy.get('.btn-sv-bar-addpecker').click()
    clickChart(X_PECKER, 750, offset, view)
  }

  function removeMaxPeak(view, offset=0) {
    cy.get('.btn-sv-bar-rmpeak').click()
    clickChart(X_MAX_PEAK, 450, offset, view)
  }

  function removeMinPeak(view, offset=0) {
    cy.get('.btn-sv-bar-rmpeak').click()
    clickChart(X_MIN_PEAK, 750, offset, view)
  }

  function removePecker(view, offset=0) {
    cy.get('.btn-sv-bar-rmpecker').click()
    clickChart(X_PECKER, 750, offset, view)
  }

  it('Zoom in and zoom out on peaks', () => {
    cy.get('[data-testid="GraphSelectionPanel"]').click();
    cy.get('[data-testid="GraphSelectionPanel"] ul > li:nth-child(2)').click();

    cy.window().then(win => {
      cy.get('.d3Svg')
      .trigger('mousedown', 1000, 300, {
        which: 1,
        view: win,
      })
      .trigger('mousemove', {
        clientX: 1200,
        clientY: 800,
        force: true,
      })
      .trigger('mouseup', {
        force: true,
        view: win,
      });

      cy.wait(1000)
      cy.get('.btn-sv-bar-zoomreset').click()
    });
    
  })

  it('Add peak and pecker', () => {
    cy.window().then(win => {
      cy.get('[data-testid="GraphSelectionPanel"]').click();
      cy.get('[data-testid="GraphSelectionPanel"] ul > li:nth-child(2)').click();
      cy.get('[data-testid="PanelVoltammetry"]').click();
      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(2)').click();

      addMaxPeak(win);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(3)').click();

      addMinPeak(win);

      addPecker(win);
    });
  })

  it('Remove peak and pecker', () => {
    cy.window().then(win => {
      cy.get('[data-testid="GraphSelectionPanel"]').click();
      cy.get('[data-testid="GraphSelectionPanel"] ul > li:nth-child(2)').click();
      cy.get('[data-testid="PanelVoltammetry"]').click();
      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(2)').click();

      addMaxPeak(win);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(3)').click();

      addMinPeak(win);

      addPecker(win);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(2)').click();

      removeMaxPeak(win);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(3)').click();

      removeMinPeak(win);

      removePecker(win);
    });
  })

  it('Add new list peak and pecker', () => {
    cy.window().then(win => {
      cy.get('[data-testid="GraphSelectionPanel"]').click();
      cy.get('[data-testid="GraphSelectionPanel"] ul > li:nth-child(2)').click();
      cy.get('[data-testid="PanelVoltammetry"]').click();
      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(2)').click();

      addMaxPeak(win);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(3)').click();

      addMinPeak(win);

      addPecker(win);


      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="AddCircleOutlineIcon"] > path').click();
      /* ==== End Cypress Studio ==== */

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(2) > td:nth-child(2)').click();

      addMaxPeak(win, 50);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(2) > td:nth-child(3)').click();

      addMinPeak(win, 50);

      addPecker(win, 50);

      /* ==== Generated with Cypress Studio ==== */
      cy.get(':nth-child(1) > :nth-child(8) > [data-testid="RemoveCircleIcon"] > path').click({force: true});
      /* ==== End Cypress Studio ==== */
    });
  })

  it('Set reference peaks', () => {
    cy.window().then(win => {
      cy.get('[data-testid="GraphSelectionPanel"]').click();
      cy.get('[data-testid="GraphSelectionPanel"] ul > li:nth-child(2)').click();
      cy.get('[data-testid="PanelVoltammetry"]').click();
      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(2)').click();

      addMaxPeak(win);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(1) > td:nth-child(3)').click();

      addMinPeak(win);

      addPecker(win);


      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="AddCircleOutlineIcon"] > path').click();
      /* ==== End Cypress Studio ==== */

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(2) > td:nth-child(2)').click();

      addMaxPeak(win, 50);

      cy.get('[data-testid="PanelVoltammetry"] table > tbody > tr:nth-child(2) > td:nth-child(3)').click();

      addMinPeak(win, 50);

      addPecker(win, 50);

      /* ==== Generated with Cypress Studio ==== */
      cy.get(':nth-child(2) > :nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
      cy.get('[data-testid="AddLocationOutlinedIcon"]').click();
      cy.get('[data-testid="Pecker"] > .MuiFormControl-root > .MuiInputBase-root > #intg-factor-name').click();
      cy.get('[data-testid="Pecker"] > .MuiFormControl-root > .MuiInputBase-root > #intg-factor-name').click();
      cy.get('[data-testid="Pecker"] > .MuiFormControl-root > .MuiInputBase-root > #intg-factor-name').click();
      cy.get('[data-testid="AddLocationOutlinedIcon"]').click();
      cy.get(':nth-child(1) > :nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
      cy.get('[data-testid="AddLocationOutlinedIcon"]').click();
      /* ==== End Cypress Studio ==== */
    });
  })
})