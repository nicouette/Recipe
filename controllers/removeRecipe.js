const db = require('../db')


function removeRecipe (req, res, id) {
  db.removeRecipie(id, () => {
    // console.log(req.body)
    res.writeHead(302, {
      Location: '/resultat'
      // add other headers here...
    })
    res.end()
  }
  )
}

module.exports = removeRecipe
