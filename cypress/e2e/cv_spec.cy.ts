describe('CV', () => {
  beforeEach(() => {
    cy.viewport(2000, 2000)
    cy.visit('http://localhost:3000/')
    cy.get('#btn-cv').click()
  })

  it('Open layout', () => {
    cy.get('.d3Line').children().should('have.class', 'd3Svg')
    cy.get('.d3Svg text.xLabel').should('have.text', 'V vs Ref')
    cy.get('.d3Svg text.yLabel').should('have.text', 'A')
  })

  function addMaxPeak(view, offset=0) {
    cy.get('.btn-sv-bar-addpeak').click()
    cy.get('.d3Svg')
      .trigger('click', 1110 + offset, 480, {
        which: 1,
        view: view,
      })
  }

  function addMinPeak(view, offset=0) {
    cy.get('.btn-sv-bar-addpeak').click()
    cy.get('.d3Svg')
      .trigger('click', 1050 + offset, 1480, {
        which: 1,
        view: view,
      })
  }

  function addPecker(view, offset=0) {
    cy.get('.btn-sv-bar-addpecker').click()
    cy.get('.d3Svg')
      .trigger('click', 1350 + offset, 1480, {
        which: 1,
        view: view,
      })
  }

  function removeMaxPeak(view, offset=0) {
    cy.get('.btn-sv-bar-rmpeak').click()
    cy.get('.d3Svg')
    .trigger('click', 1110 + offset, 450, {
      which: 1,
      view: view,
    })
  }

  function removeMinPeak(view, offset=0) {
    cy.get('.btn-sv-bar-rmpeak').click()
    cy.get('.d3Svg')
      .trigger('click', 1050 + offset, 900, {
        which: 1,
        view: view,
      })
  }

  function removePecker(view, offset=0) {
    cy.get('.btn-sv-bar-rmpecker').click()
    cy.get('.d3Svg')
      .trigger('click', 1350 + offset, 800, {
        which: 1,
        view: view,
      })
  }

  it('Zoom in and zoom out on peaks', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-testid="GraphSelectionPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content').click();
    cy.get(':nth-child(2) > .GraphSelectionPanel-curve-603').click();
    /* ==== End Cypress Studio ==== */

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
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="GraphSelectionPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content').click();
      cy.get(':nth-child(2) > .GraphSelectionPanel-curve-603').click();
      cy.get(':nth-child(3) > .MuiAccordionSummary-root > .MuiAccordionSummary-content').click();
      cy.get('.CyclicVoltammetryPanel-cellSelected-643').click();
      /* ==== End Cypress Studio ==== */

      addMaxPeak(win);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click();
      /* ==== End Cypress Studio ==== */

      addMinPeak(win);

      addPecker(win);
    });
  })

  it('Remove peak and pecker', () => {
    cy.window().then(win => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="GraphSelectionPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content').click();
      cy.get(':nth-child(2) > .GraphSelectionPanel-curve-603').click();
      cy.get(':nth-child(3) > .MuiAccordionSummary-root > .MuiAccordionSummary-content').click();
      cy.get('.CyclicVoltammetryPanel-cellSelected-643').click();
      /* ==== End Cypress Studio ==== */

      addMaxPeak(win);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click();
      /* ==== End Cypress Studio ==== */

      addMinPeak(win);

      addPecker(win);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(2)').click();
      /* ==== End Cypress Studio ==== */
      removeMaxPeak(win);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click();
      /* ==== End Cypress Studio ==== */
      removeMinPeak(win);

      removePecker(win);
    });
  })

  it('Add new list peak and pecker', () => {
    cy.window().then(win => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="GraphSelectionPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content').click();
      cy.get(':nth-child(2) > .GraphSelectionPanel-curve-603').click();
      cy.get(':nth-child(3) > .MuiAccordionSummary-root > .MuiAccordionSummary-content').click();
      cy.get('.CyclicVoltammetryPanel-cellSelected-643').click();
      /* ==== End Cypress Studio ==== */

      addMaxPeak(win);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click();
      /* ==== End Cypress Studio ==== */

      addMinPeak(win);

      addPecker(win);


      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="AddCircleOutlineIcon"] > path').click();
      cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(2)').click();
      /* ==== End Cypress Studio ==== */

      addMaxPeak(win, 50);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(3)').click();
      /* ==== End Cypress Studio ==== */

      addMinPeak(win, 50);

      addPecker(win, 50);

      /* ==== Generated with Cypress Studio ==== */
      cy.get(':nth-child(1) > :nth-child(8) > [data-testid="RemoveCircleIcon"] > path').click({force: true});
      /* ==== End Cypress Studio ==== */
    });
  })

  it('Set reference peaks', () => {
    cy.window().then(win => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="GraphSelectionPanel"] > .MuiButtonBase-root > .MuiAccordionSummary-content').click();
      cy.get(':nth-child(2) > .GraphSelectionPanel-curve-603').click();
      cy.get(':nth-child(3) > .MuiAccordionSummary-root > .MuiAccordionSummary-content').click();
      cy.get('.CyclicVoltammetryPanel-cellSelected-643').click();
      /* ==== End Cypress Studio ==== */

      addMaxPeak(win);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(3)').click();
      /* ==== End Cypress Studio ==== */

      addMinPeak(win);

      addPecker(win);


      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="AddCircleOutlineIcon"] > path').click();
      cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(2)').click();
      /* ==== End Cypress Studio ==== */

      addMaxPeak(win, 50);

      /* ==== Generated with Cypress Studio ==== */
      cy.get('.MuiTableBody-root > :nth-child(2) > :nth-child(3)').click();
      /* ==== End Cypress Studio ==== */

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

  it('Change axes labels', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[aria-labelledby="select-x-axis-label"]').click();
    cy.get('[data-value="Voltage in V"]').click();
    cy.get('[aria-labelledby="select-y-axis-label"]').click();
    cy.get('[data-value="Current in A"]').click();
    // /* ==== End Cypress Studio ==== */

    cy.get('.d3Svg text.xLabel').should('have.text', 'Voltage in V')
    cy.get('.d3Svg text.yLabel').should('have.text', 'Current in A')

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[aria-labelledby="select-x-axis-label"]').click();
    cy.get('[data-value="Voltage vs Ref in V"]').click();
    cy.get('[aria-labelledby="select-y-axis-label"]').click();
    cy.get('[data-value="Current in mA"]').click();
    // /* ==== End Cypress Studio ==== */

    cy.get('.d3Svg text.xLabel').should('have.text', 'Voltage vs Ref in V')
    cy.get('.d3Svg text.yLabel').should('have.text', 'Current in mA')

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[aria-labelledby="select-x-axis-label"]').click();
    cy.get('[data-value="Potential in V"]').click();
    cy.get('[aria-labelledby="select-y-axis-label"]').click();
    cy.get('[data-value="Current in A"]').click();
    /* ==== End Cypress Studio ==== */

    cy.get('.d3Svg text.xLabel').should('have.text', 'Potential in V')
    cy.get('.d3Svg text.yLabel').should('have.text', 'Current in A')

    // /* ==== Generated with Cypress Studio ==== */
    cy.get('[aria-labelledby="select-x-axis-label"]').click();
    cy.get('[data-value="Potential vs Ref in V"]').click();
    cy.get('[aria-labelledby="select-y-axis-label"]').click();
    cy.get('[data-value="Current in mA"]').click();
    /* ==== End Cypress Studio ==== */

    cy.get('.d3Svg text.xLabel').should('have.text', 'Potential vs Ref in V')
    cy.get('.d3Svg text.yLabel').should('have.text', 'Current in mA')

  })
})