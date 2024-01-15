describe('HPLC UV/VIS', () => {
  beforeEach(() => {
    cy.viewport(2000, 2000)
    cy.visit('http://localhost:3000/')
    cy.get('#btn-hplc').click()
  })

  it('Open layout', () => {
    cy.get('.d3Line').children().should('have.class', 'd3Svg')
    cy.get('.d3Svg text.xLabel').should('have.text', 'X (MINUTES)')
    cy.get('.d3Svg text.yLabel').should('have.text', 'Y (TRANSMITTANCE)')
  })

  function addPeak(view) {
    cy.get('.btn-sv-bar-addpeak').click()
    const basePointX = 50;
    for (let index = 0; index < 10; index++) {
      cy.get('.d3Svg')
      .trigger('click', basePointX*index, 1200, {
        which: 1,
        view: view,
      })
    }
  }

  function removePeak(view) {
    cy.get('.btn-sv-bar-addpeak').click()
    const basePointX = 50;
    cy.get('.btn-sv-bar-rmpeak').click()
      for (let index = 0; index < 10; index++) {
        cy.get('.d3Svg')
        .trigger('click', basePointX*index, 1420, {
          which: 1,
          view: view,
        })
      }
  }

  function addIntegration(view) {
    cy.get('.btn-add-inter').click()
    cy.get('.d3Svg')
    .trigger('mousedown', 600, 1200, {
      which: 1,
      view: view,
    })
    .trigger('mousemove', {
      clientX: 700,
      clientY: 1500,
      force: true,
    })
    .trigger('mouseup', {
      force: true,
      view: view,
    });
  }

  it('Zoom in and zoom out on peaks', () => {
    cy.window().then(win => {
      cy.get('.d3Svg')
      .trigger('mousedown', 400, 100, {
        which: 1,
        view: win,
      })
      .trigger('mousemove', {
        clientX: 800,
        clientY: 1000,
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

  it('Add peak', () => {
    cy.window().then(win => {
      addPeak(win);
    });
  })

  it('Remove peak', () => {
    cy.window().then(win => {
      addPeak(win);

      removePeak(win);
    });
  })

  it('Add integration', () => {
    cy.window().then(win => {
      addIntegration(win);
    });
  })

  it('Remove integration', () => {
    cy.window().then(win => {
      addIntegration(win);

      cy.get('.btn-remove-inter').click()
      cy.get('.d3Svg')
      .trigger('click', 700, 1400, {
        which: 1,
        view: win,
      })
    });
  })

  it('Clear all integration', () => {
    cy.get('.icon-sv-bar-rmallint').click()
    cy.get('.btn-sv-bar-no').click()
    cy.get('.icon-sv-bar-rmallint').click()
    cy.get('.btn-sv-bar-yes').click()
  })
})