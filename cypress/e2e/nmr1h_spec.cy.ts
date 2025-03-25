describe('NMR 1H', () => {
  beforeEach(() => {
    cy.viewport(2000, 2000)
    cy.visit('http://localhost:3000/')
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
    .trigger('mousedown', 500, 1200, {
      which: 1,
      view: view,
    })
    .trigger('mousemove', {
      clientX: 800,
      clientY: 1500,
      force: true,
    })
    .trigger('mouseup', {
      force: true,
      view: view,
    });
  }

  function addMultiplicity(view) {
    cy.get('.btn-sv-bar-addmpy').click()
    cy.get('.d3Svg')
    .trigger('mousedown', 500, 1200, {
      which: 1,
      view: view,
    })
    .trigger('mousemove', {
      clientX: 800,
      clientY: 1500,
      force: true,
    })
    .trigger('mouseup', {
      force: true,
      view: view,
    })
  }

  it('Open layout', () => {
    cy.get('button').contains('NMR 1H').click()
    cy.get('.btn-sv-bar-spctrum').click()
    cy.get('.input-sv-bar-layout').click()
    cy.get('.option-sv-bar-layout').should($li => {
      expect($li).to.have.length(25)
    })
    cy.get('ul li:nth-child(9)').click()

    cy.get('.d3Line').children().should('have.class', 'd3Svg')
    cy.get('.d3Svg text.xLabel').should('have.text', 'X (PPM)')
    cy.get('.d3Svg text.yLabel').should('have.text', 'Y (ARBITRARY)')
  })

  it('Zoom in and zoom out on peaks', () => {
    cy.window().then(win => {
      cy.get('.d3Svg')
      .trigger('mousedown', 350, 1400, {
        which: 1,
        view: win,
      })
      .trigger('mousemove', {
        clientX: 450,
        clientY: 1500,
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

  it('Add peak reference', () => {
    cy.window().then(win => {
      addPeak(win);

      cy.get('.btn-sv-bar-setref').click()
      for (let index = 0; index < 10; index++) {
        cy.get('.d3Svg')
        .trigger('click', 50*index, 1420, {
          which: 1,
          view: win,
        })
      }
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
      .trigger('click', 500, 50, {
        which: 1,
        view: win,
      })
    });
  })

  it('Change ref area', () => {
    cy.window().then(win => {
      addIntegration(win);

      cy.get('#intg-factor-name').type('10')
      cy.get('#intg-factor-name').clear().type('2')
    });
  })

  it('Set ref integration', () => {
    cy.window().then(win => {
      addIntegration(win);

      cy.get('.btn-set-inter-ref').click()
      cy.get('.d3Svg')
      .trigger('click', 500, 50, {
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

  it('Add mulitplicity', () => {
    cy.window().then(win => {
      addMultiplicity(win);
    });
  })

  it('Remove mulitplicity', () => {
    cy.window().then(win => {
      addMultiplicity(win);

      cy.get('.btn-sv-bar-rmmpy').click()
      cy.get('.d3Svg')
      .trigger('click', 500, 50, {
        which: 1,
        view: win,
      })
    });
  })

  it('Clear all multiplicity', () => {
    cy.get('.txt-sv-bar-rmallmpy').click()
    cy.get('.btn-sv-bar-no').click()
    cy.get('.txt-sv-bar-rmallmpy').click()
    cy.get('.btn-sv-bar-yes').click()
  })

  it('Add peak for mulitplicity', () => {
    cy.window().then(win => {
      addMultiplicity(win);

      cy.get('.btn-sv-bar-addpeakmpy').click()
      for (let index = 0; index < 5; index++) {
        cy.get('.d3Svg')
        .trigger('click', 500+(index*10 + 10), 1200, {
          which: 1,
          view: win,
        })
      }
    });
  })

  it('Remove peak for mulitplicity', () => {
    cy.window().then(win => {
      addMultiplicity(win);

      cy.get('.btn-sv-bar-addpeakmpy').click()
      for (let index = 0; index < 5; index++) {
        cy.get('.d3Svg')
        .trigger('click', 500+(index*10 + 10), 1200, {
          which: 1,
          view: win,
        })
      }

      cy.get('.btn-sv-bar-rmpeakmpy').click()
      for (let index = 0; index < 5; index++) {
        cy.get('.d3Svg')
        .trigger('click', 500+(index*10 + 10), 1485, {
          which: 1,
          view: win,
        })
      }
    });
  })
})