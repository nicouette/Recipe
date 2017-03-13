import qs from 'qs'
import { getRecipie } from '../db'
// je mets{} car je n'utilise que cette constante. si j'utile tout le fichier, quand j'utilise la constante serv j'aurais mis '.server.serv'
import { serv } from '../server'

const hippie = require('hippie')
const expect = require('chai').expect

function stringify (data, fn) {
  fn(null, qs.stringify(data, {arrayFormat: 'repeat'}).toString('utf8'))
}

function compareIngredient (a, b) {
  if (a.nom < b.nom) {
    return -1
  }
  if (a.nom > b.nom) {
    return 1
  }
  // a doit être égal à b
  return 0
}

describe('when I post a recipe …', () => {
  it('returns 302 when the recipe is ok with many ingredients', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .serializer(stringify)
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecipe')
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
        expect(results.ingredients).to.be.deep.equal([
          {nom: 'pâte feuilleté', quantité: 1, unité: null},
          {nom: 'prune', quantité: 1000, unité: 'gr'}
        ])
      })
  })
  it('returns 302 when the recipe is ok without ingredients', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecipe')
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
        expect(results.ingredients).to.be.deep.equal([
        ])
      })
  })
  it('returns 302 when the recipe is ok with only 1 ingredient with a quantity', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecipe')
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
        expect(results.ingredients).to.be.deep.equal([
          {nom: 'beurre', quantité: 150, unité: 'gr'}
        ])
      })
  })
  it('returns 302 when the recipe is ok with only 1 ingredient without a unity defined', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecipe')
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
        expect(results.ingredients).to.be.deep.equal([
          {nom: 'beurre', quantité: 150, unité: null}
        ])
      })
  })
  it('returns 302 when the recipe is ok with ingredients some of them including unité and one without unité', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .serializer(stringify)
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecipe')
      .send({
        Nom: 'tarte à la tomate',
        Description: 'mélanger tous les ingrédients et mettre au four',
        Type: 'entrée',
        Ingrédient: ['pâte feuilleté', 'tomate', 'concentré de tomate', 'oeuf'],
        Quantité: ['1', '1000', '100', '2'],
        Unité: [null, 'gr', 'ml', null]
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
        expect(results.nom).to.be.equal('tarte à la tomate')
        // to be done later if I choose to retrieve type in recipe view expect(results.type).to.be.equal('dessert')
        expect(results.description).to.be.equal('mélanger tous les ingrédients et mettre au four')
        expect(results.ingredients.sort(compareIngredient)).to.be.deep.equal([
          {nom: 'concentré de tomate', quantité: 100, unité: 'ml'},
          {nom: 'oeuf', quantité: 2, unité: null},
          {nom: 'pâte feuilleté', quantité: 1, unité: null},
          {nom: 'tomate', quantité: 1000, unité: 'gr'}
        ])
      // expect(results.)
      })
  })
  it('returns 302 when the recipe is ok with all ingredients without unité', () => {
    // comme nous sommes en asynchrone :return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .serializer(stringify)
      .app(serv)
      // .base('http://localhost:8080')
      .post('/addRecipe')
      .send({
        Nom: 'tarte salée',
        Description: 'mélanger tous les ingrédients et mettre au four',
        Type: 'entrée',
        Ingrédient: ['pâte feuilleté', 'oeuf', 'noix de cajou'],
        Quantité: ['1', '3', '35'],
        Unité: [null, null, null]
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
        expect(results.nom).to.be.equal('tarte salée')
        // to be done later if I choose to retrieve type in recipe view expect(results.type).to.be.equal('dessert')
        expect(results.description).to.be.equal('mélanger tous les ingrédients et mettre au four')
        expect(results.ingredients.sort(compareIngredient)).to.be.deep.equal([
          {nom: 'noix de cajou', quantité: 35, unité: null},
          {nom: 'oeuf', quantité: 3, unité: null},
          {nom: 'pâte feuilleté', quantité: 1, unité: null}
        ])
      // expect(results.)
      })
  })
})
