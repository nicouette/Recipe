const Mysql = require('../script_mysql')

const template = require('./template')


function resultat (req, res) {
  Mysql.getAllRecipies((results) => {
    const context = {
      lines: results,
      title: 'Nouvelle Recette'
    }
    template.resultsPage(req, res, context)
  }
  )
}
module.exports = resultat

