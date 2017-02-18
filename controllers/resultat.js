const db = require('../db')

const template = require('./template')


function resultat (req, res) {
  db.getAllRecipies((results) => {
    const context = {
      lines: results,
      title: 'Nouvelle Recette'
    }
    template.resultsPage(req, res, context)
  }
  )
}
module.exports = resultat

