const Mysql = require('../script_mysql')


function suppressionRecette (req, res, id) {
  Mysql.removeRecipie(id, () => {
    // console.log(req.body)
    res.writeHead(302, {
      Location: '/resultat'
      // add other headers here...
    })
    res.end()
  }
  )
}

module.exports = suppressionRecette
