const fs = require('fs')
const path = require('path')

// charge module handlebars
const Handlebars = require('handlebars')

// on lit le fichier template
const head = fs.readFileSync(path.join(__dirname, '..', 'templates', 'head.handlebars'))
const nav = fs.readFileSync(path.join(__dirname, '..', 'templates', 'nav.handlebars'))
const footer = fs.readFileSync(path.join(__dirname, '..', 'templates', 'footer.handlebars'))
const index = fs.readFileSync(path.join(__dirname, '..', 'templates', 'welcome.handlebars'))
const comment = fs.readFileSync(path.join(__dirname, '..', 'templates', 'addComment.handlebars'))
const addRecette = fs.readFileSync(path.join(__dirname, '..', 'templates', 'ajoutRecette.handlebars'))
const results = fs.readFileSync(path.join(__dirname, '..', 'templates', 'resultat.handlebars'))


Handlebars.registerPartial('head', head.toString())
Handlebars.registerPartial('nav', nav.toString())
Handlebars.registerPartial('footer', footer.toString())

// on utilise library qui va le mettre ready to be used - pas de résultats
const welcomeTemplate = Handlebars.compile(index.toString())
function welcome(req, res) {
  const context = {
    title: 'Accueil'
  }
  pageToDisplay(req, res, welcomeTemplate, context)
}

const commentTemplate = Handlebars.compile(comment.toString())
function commentPage(req, res) {
  const context = {
    title: 'Commentaire'
  }
  pageToDisplay(req, res, commentTemplate, context)
}

const addRecetteTemplate = Handlebars.compile(addRecette.toString())
function addRecettePage (req, res) {
  const context = {
    title: 'Nouvelle Recette'
  }
  pageToDisplay(req, res, addRecetteTemplate, context)
}

const ResultTemplate = Handlebars.compile(results.toString())
function resultsPage (req, res, context) {
  pageToDisplay(req, res, ResultTemplate, context)
}

function pageToDisplay(req, res, template, context) {
  const html = template(context)
  res.write(html)
  res.end()
}


module.exports = { welcome, commentPage, addRecettePage, resultsPage }

