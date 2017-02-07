const Mysql = require('../script_mysql')
const bodyParser = require('body-parser')

function addComment(req, res) {
  const parseBody = bodyParser.urlencoded({ extended: false })
  parseBody(req, res, () => {
    let titre
    let description
    let type
    let objetId
    console.log(req.body)
    titre = req.body.Titre
    description = req.body.Description
    type = req.body.type
    objetId = req.body.id
    Mysql.addComment(titre, description, type, objetId, () => {
      res.write('hello')
      res.end()
    })
    })
}
module.exports = addComment
