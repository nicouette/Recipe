const db = require('../db')
const bodyParser = require('body-parser')


function addComment (req, res) {
  const parseBody = bodyParser.urlencoded({extended: false})
  parseBody(req, res, () => {
    //console.log(req.body)
    const titre = req.body.Titre
    const description = req.body.Description
    const type = req.body.type
    const objetId = req.body.id
    db.addComment(titre, description, type, objetId, () => {
      // res.write(confirmationAjout)
      res.writeHead(302, {
        Location: `/recette?id=${objetId}`
        // add other headers here...
      })
      res.end()
      //  res.end()
    })
  })
}
module.exports = addComment
