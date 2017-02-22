const db = require('../db')

const hippie = require('hippie')
const expect = require('chai').expect

// index est sous entendu
const serv = require('../')

describe('when I post a recipe …', () => {
  it('returns 302 when the recipe is ok with many ingredients', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecette')
      .send({Nom: 'tarte', Description: 'mélanger tous les ingrédients et mettre au four', Type: 'dessert'})
      .expectStatus(302)
      .end()
      .then((res) => {
        const recetteId = res.headers.location.split('=')[1]
        return new Promise((resolve, reject) => {
          db.getRecipie(recetteId, (results) => {
            console.log(results)
            resolve(results)
          })
        })
      }
    )
      .then((results) => {
        expect(results.nom).to.be.equal('tarte')
        // to be done later if I choose to retrieve type in recipe view expect(results.type).to.be.equal('dessert')
        expect(results.description).to.be.equal('mélanger tous les ingrédients et mettre au four')
      })
  })
})
