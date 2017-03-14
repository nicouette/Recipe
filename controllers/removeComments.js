const db = require('../db')


function removeComments (req, res, id, objetId) {
  db.removeComments(id, () => {
    // console.log(req.body)
    res.writeHead(302, {
      Location: `/recette?id=${objetId}`
      // add other headers here...
    })
    res.end()
  }
  )
}

module.exports = removeComments
