const Mysql = require('../script_mysql')
const fs = require('fs')
const path = require('path')

// charge module handlebars
const Handlebars = require('handlebars')

// on lit le fichier template
const resultats = fs.readFileSync(path.join(__dirname, '..', 'Html', 'resultat.handlebars'))

// on utilise library qui va le mettre ready to be used - pas de résultats
const templateResultat = Handlebars.compile(resultats.toString())

function resultat (req, res) {
  Mysql.getAllRecipies((results) => {
    const context = {
      lines: results
    }
    const html = templateResultat(context)
    res.write(html)
    res.end()
  }
  )
}
module.exports = resultat

