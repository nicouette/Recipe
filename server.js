const url = require('url')
const statiq = require('node-static')

const addRecette = require('./controllers/addRecipe')
const resultat = require('./views/resultat')

const viewRecette = require('./views/viewRecette')
const suppressionRecette = require('./controllers/removeRecipe')
const editRecipe = require('./views/editRecipe')

const suppressionCommentaire = require('./controllers/removeComments')

const addComment = require('./controllers/addComments')
const resultatByNom = require('./views/searchRecette')
const template = require('./views/template')

// retrieve http module
const http = require('http')

// je vais mettre les fichiers statics et ensuite sera automatiquement généré le code nécessaire "parsedUrl… res.write…res.end" qui permet que les fichiers soient connus
const files = new statiq.Server('./pub')

// create server with function, ce qu'il fait
export const server = http.createServer(tryServ)
function tryServ (req, res) {
  try {
    // quelque chose qu'on va essayer
    serv(req, res)
  } catch (error) {
    // quand on attrape une erreur je declare fonction error et exe ce qui est déf dans la fonction
    console.log(error)
  }
}

export function serv (req, res) {
  // => pour les functions sans nom entre autres
  const parsedUrl = url.parse(`http://èlèl${req.url}`, true)
  // console.log(parsedUrl)
  if (parsedUrl.pathname === '/resultat') {
    resultat(req, res)
  // ici /recette ce n'est pas la page mais l'url - doit être identique à celle définit dans resultat.moustache
  // avec parsedUrl je n'ai que /recette qui est pris en compte dans url et pas l'id (search)
  } else if (parsedUrl.pathname === '/recette') {
    viewRecette(req, res, parsedUrl.query.id)
  } else if (parsedUrl.pathname === '/addRecipe') {
    addRecette(req, res)
  } else if (parsedUrl.pathname === '/editRecipe') {
    editRecipe(req, res, parsedUrl.query.id)
  } else if (parsedUrl.pathname === '/ajoutRecette.html') {
    template.addRecettePage(req, res, {title: 'Nouvelle Recette'})
  } else if (parsedUrl.pathname === '/removeRecipe') {
    // parsedUrl.query.id permet de récupérer l'id de la recette
    suppressionRecette(req, res, parsedUrl.query.id)
  } else if (parsedUrl.pathname === '/addComments') {
    addComment(req, res)
  } else if (parsedUrl.pathname === '/rechercheRecette.html') {
    template.searchRecettePage(req, res)
  } else if (parsedUrl.pathname === '/searchRecette') {
    resultatByNom(req, res)
  } else if (parsedUrl.pathname === '/addComment.html') {
    template.commentPage(req, res)
  } else if (parsedUrl.pathname === '/removeComments') {
    suppressionCommentaire(req, res, parsedUrl.query.id, parsedUrl.query.recetteId)
  } else if (parsedUrl.pathname === '/') {
    template.welcome(req, res)
  } else {
    // sinon c'est le serveur static qui gère
    req.addListener('end', () => {
      files.serve(req, res, (error) => {
        if (error && (error.status === 404)) { // If the file wasn't found
          files.serveFile('/not-found.html', 404, {}, req, res)
        }
      })
    }).resume()
  }
}
