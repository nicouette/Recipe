const Mysql = require('../script_mysql')

const template = require('./template')

function viewRecette (req, res, id) {
  Mysql.getRecipie(id, (result) => {
    const context = {
      title: 'Recette',
      // recette est la facon dont je veux nommer l'objet result
      recette: result
    }
    template.viewRecettePage(req, res, context)
  //  console.log(context.recette.nom)
  }
  )
}
module.exports = viewRecette
