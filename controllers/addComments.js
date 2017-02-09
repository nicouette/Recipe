const Mysql = require('../script_mysql')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const confirmationAjout = fs.readFileSync(path.join(__dirname, '..', 'Html', 'confirmation3.html'))

function addComment (req, res) {
  const parseBody = bodyParser.urlencoded({extended: false})
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
      res.write(confirmationAjout)
      res.end()
    })
  })
}
module.exports = addComment
