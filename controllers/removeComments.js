const Mysql = require('../script_mysql')


function suppressionCommentaire (req, res, id, objetId) {
  Mysql.removeComments(id, () => {
    // console.log(req.body)
    res.writeHead(302, {
      Location: `/recette?id=${objetId}`
      // add other headers here...
    })
    res.end()
  }
  )
}

module.exports = suppressionCommentaire
