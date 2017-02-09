// fonction entre autre pour lire les fichiers avec fs
const fs = require('fs')
const Mysql = require('../script_mysql')
const path = require('path')

const confirmation = fs.readFileSync(path.join(__dirname, '..', 'Html', 'confirmation.html'))

function suppressionCommentaire (req, res, id) {
  Mysql.removeComments(id, () => {
    // console.log(req.body)
    res.write(confirmation)
    res.end()
  }
  )
}

module.exports = suppressionCommentaire
