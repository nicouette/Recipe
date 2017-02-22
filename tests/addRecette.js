const hippie = require('hippie')
// index est sous entendu
const serv = require('../')

describe('when I post a recipe …', () => {
  it('returns 302 when the recipe is ok with many ingredients', () => {
    // comme nous sommes en asynchrone : return hippie et non hippie seul -comportement spécifique à mocha
    return hippie()
      .form()
      .app(serv)
      //.base('http://localhost:8080')
      .post('/addRecette')
      .send({Nom: 'tarte', Type: 'dessert'})
      .expectStatus(302)
      .end()
  })
})
