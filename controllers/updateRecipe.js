const bodyParser = require('body-parser')
const db = require('../db')

function updateRecipe (req, res, recetteId) {
  const parseBody = bodyParser.urlencoded({extended: false})

  parseBody(req, res, () => {
    db.updateRecipe(recetteId, req.body.Nom, req.body.Description, req.body.Type, () => {
      let ingredients
      let quantites
      let unites
      console.log(req.body)
      if (req.body.Ingrédient === undefined) { // j'exe addIngredient. si on a 0 ingrédient on veut que rien ne se fasse
        ingredients = []
        quantites = []
        unites = []
      } else if (Array.isArray(req.body.Ingrédient)) {
        // j'exe addIngredients
        ingredients = req.body.Ingrédient
        quantites = req.body.Quantité
        unites = req.body.Unité.map((u) => {
          if (u === '') { return null }
          return u
        })
      } else { // j'exe addIngredient. si on a qu'1 ingrédient on transforme la valeur en tableau et on met le résultat dans notre variable
        ingredients = [req.body.Ingrédient]
        quantites = [req.body.Quantité]
        unites = [req.body.Unité]
      }
      db.updateIngredients(recetteId, ingredients, quantites, unites, () => {

        res.writeHead(302, {
          Location: `/recette?id=${recetteId}`
        })
        res.end()
      })
    })
  })
}
module.exports = updateRecipe
