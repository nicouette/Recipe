const db = require('../db')
const template = require('./template')
const bodyParser = require('body-parser')

const parseBody = bodyParser.urlencoded({extended: false})

function resultatRecherche (req, res) {
  parseBody(req, res, () => {
    const nom = req.body.Nom
    const type = req.body.Type
    db.getRecipes(nom, type, (results) => {
      if (results.length === 0) {
        // alors j'affiche la page "noresult"
        template.noResultsPage(req, res)
      } else {
        const context = {
          lines: results,
          title: 'Résultat de la recherche'
        }
        template.resultsPage(req, res, context)
      }
    }
    )
  })
}
module.exports = resultatRecherche
