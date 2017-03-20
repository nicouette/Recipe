const db = require('../db')

const template = require('./template')

function viewRecette (req, res, id) {
  db.getRecipe(id, (result) => {
    const context = {
      title: 'Recette',
      // recette est la facon dont je veux nommer l'objet result
      recette: result
    }
    template.addRecettePage(req, res, context)
  //  console.log(context.recette.nom)
  }
  )
}
module.exports = viewRecette
