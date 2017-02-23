import { getRecipie } from '../db'
import qs from 'qs'

const hippie = require('hippie')
const expect = require('chai').expect

// index est sous entendu
const serv = require('../')

function stringify (data, fn) {
  fn(null, qs.stringify(data, {arrayFormat: 'repeat'}).toString('utf8'))
}

describe('when I post a recipe …', () => {
  it('returns 302 when the recipe is ok with many ingredients', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .serializer(stringify)
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecette')
      .send({
        Nom: 'tarte',
        Description: 'mélanger tous les ingrédients et mettre au four',
        Type: 'dessert',
        Ingrédient: ['pâte feuilleté', 'prune'],
        Quantité: ['1', '1000'],
        Unité: [null, 'gr']
      })
      .expectStatus(302)
      .end()
      .then((res) => {
        const recetteId = res.headers.location.split('=')[1]
        return new Promise((resolve, reject) => {
          getRecipie(recetteId, (results) => {
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
      // expect(results.)
      })
  })
  it('returns 302 when the recipe is ok without ingredients', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecette')
      .send({Nom: 'tarte aux pommes', Description: 'mélanger tous les ingrédients et mettre au four', Type: 'dessert'})
      .expectStatus(302)
      .end()
      .then((res) => {
        const recetteId = res.headers.location.split('=')[1]
        return new Promise((resolve, reject) => {
          getRecipie(recetteId, (results) => {
            resolve(results)
          })
        })
      }
    )
      .then((results) => {
        expect(results.nom).to.be.equal('tarte aux pommes')
        // to be done later if I choose to retrieve type in recipe view expect(results.type).to.be.equal('dessert')
        expect(results.description).to.be.equal('mélanger tous les ingrédients et mettre au four')
      })
  })
    it('returns 302 when the recipe is ok with only 1 ingredient with a quantity', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecette')
      .send({
        Nom: 'pâte feuilleté',
        Description: 'mélanger tous les ingrédients et mettre au four',
        Type: 'dessert',
        Ingrédient: 'beurre',
        Quantité: 150,
        Unité: 'gr'
      })
      .expectStatus(302)
      .end()
      .then((res) => {
        const recetteId = res.headers.location.split('=')[1]
        return new Promise((resolve, reject) => {
          getRecipie(recetteId, (results) => {
            console.log(results)
            resolve(results)
          })
        })
      }
    )
      .then((results) => {
        expect(results.nom).to.be.equal('pâte feuilleté')
        // to be done later if I choose to retrieve type in recipe view expect(results.type).to.be.equal('dessert')
        expect(results.description).to.be.equal('mélanger tous les ingrédients et mettre au four')
      // expect(results.)
      })
  })
    it('returns 302 when the recipe is ok with only 1 ingredient without a unity defined', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecette')
      .send({
        Nom: 'pâte feuilleté',
        Description: 'mélanger tous les ingrédients et mettre au four',
        Type: 'dessert',
        Ingrédient: 'beurre',
        Quantité: 150
      })
      .expectStatus(302)
      .end()
      .then((res) => {
        const recetteId = res.headers.location.split('=')[1]
        return new Promise((resolve, reject) => {
          getRecipie(recetteId, (results) => {
            console.log(results)
            resolve(results)
          })
        })
      }
    )
      .then((results) => {
        expect(results.nom).to.be.equal('pâte feuilleté')
        // to be done later if I choose to retrieve type in recipe view expect(results.type).to.be.equal('dessert')
        expect(results.description).to.be.equal('mélanger tous les ingrédients et mettre au four')
      // expect(results.)
      })
  })
it('returns 302 when the recipe is ok with ingredients some of them including unité and one without unité')
it('returns 302 when the recipe is ok with all ingredients without unité')
})
