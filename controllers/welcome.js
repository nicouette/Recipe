const fs = require('fs')
const path = require('path')

// charge module handlebars
const Handlebars = require('handlebars')

// on lit le fichier template
const head = fs.readFileSync(path.join(__dirname, '..', 'templates', 'head.handlebars'))
const nav = fs.readFileSync(path.join(__dirname, '..', 'templates', 'nav.handlebars'))
const footer = fs.readFileSync(path.join(__dirname, '..', 'templates', 'footer.handlebars'))
const resultats = fs.readFileSync(path.join(__dirname, '..', 'templates', 'welcome.handlebars'))


Handlebars.registerPartial('head', head.toString())
Handlebars.registerPartial('nav', nav.toString())
Handlebars.registerPartial('footer', footer.toString())

// on utilise library qui va le mettre ready to be used - pas de résultats
const templateResultat = Handlebars.compile(resultats.toString())

function welcome (req, res) {
  const context = {
  }
  const html = templateResultat(context)
  res.write(html)
  res.end()
}


module.exports = welcome

