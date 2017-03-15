const bodyParser = require('body-parser')
const db = require('../db')

function updateRecipe (req, res, recetteId) {
  const parseBody = bodyParser.urlencoded({extended: false})
  parseBody(req, res, () => {
    db.updateRecipe(recetteId, req.body.Nom, req.body.Description, req.body.Type, () => {
      res.writeHead(302, {
        Location: `/recette?id=${recetteId}`
      })
      res.end()
    }
    )
  })
}
module.exports = updateRecipe
