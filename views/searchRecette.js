const db = require('../db')
const template = require('./template')
const bodyParser = require('body-parser')

const parseBody = bodyParser.urlencoded({extended: false})

function resultatByNom (req, res) {
  parseBody(req, res, () => {
    const name = req.body.Nom
    db.getRecipeByName(name, (results) => {
      const context = {
        lines: results,
        title: 'Résultat de la recherche'
      }
      template.resultsPage(req, res, context)
    }
    )
  })
}
module.exports = resultatByNom
