const url = require('url')
const statiq = require('node-static')

const addRecette = require('./controllers/addRecette')
const suppressionRecette = require('./controllers/suppressionRecette')
const resultat = require('./controllers/resultat')
const viewRecette = require('./controllers/viewRecette')
const addComment = require('./controllers/addComments')
const suppressionCommentaire = require('./controllers/removeComments')

// retrieve http module
const http = require('http')

// je vais mettre les fichiers statics et ensuite sera automatiquement généré le code nécessaire "parsedUrl… res.write…res.end" qui permet que les fichiers soient connus
const files = new statiq.Server('./pub')

// create server with function, ce qu'il fait
const server = http.createServer((req, res) => {
  // => pour les functions sans nom entre autres
  const parsedUrl = url.parse(`http://èlèl${req.url}`, true)
  // console.log(parsedUrl);
  if (parsedUrl.pathname === '/resultat') {
    resultat(req, res)
    // ici /recette ce n'est pas la page mais l'url - doit être identique à celle définit dans resultat.moustache
    // avec parsedUrl je n'ai que /recette qui est pris en compte dans url et pas l'id (search)
  } else if (parsedUrl.pathname === '/recette') {
    viewRecette(req, res, parsedUrl.query.id)
  } else if (parsedUrl.pathname === '/addRecette') {
    addRecette(req, res)
  } else if (parsedUrl.pathname === '/suppressionRecette') {
    // parsedUrl.query.id permet de récupérer l'id de la recette
    suppressionRecette(req, res, parsedUrl.query.id)
  } else if (parsedUrl.pathname === '/addComments') {
    addComment(req, res)
  } else if (parsedUrl.pathname === '/removeComments') {
    suppressionCommentaire(req, res, parsedUrl.query.id)
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
})
// start server
server.listen(8080)

