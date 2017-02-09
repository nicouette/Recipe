const Mysql = require('../script_mysql')
const fs = require('fs')
const path = require('path')

// charge module handlebars
const Handlebars = require('handlebars')

// on lit la page recette - ici recette.html est le nom du fichier
const recette = fs.readFileSync(path.join(__dirname, '..', 'Html', 'recette.handlebars'))

// compilation du template
const templateRecette = Handlebars.compile(recette.toString())

function viewRecette (req, res, id) {
  Mysql.getRecipie(id, (results) => {
    const html = templateRecette(results)
    res.write(html)
    res.end()
  }
 )
}
module.exports = viewRecette

