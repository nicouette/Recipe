// fonction entre autre pour lire les fichiers avec fs
const fs = require('fs')
const path = require('path')
const url = require('url')

// charge module handlebars
const Handlebars = require('handlebars')

// charger mon module mysql, indiquer le nom du fichier
const Mysql = require('./script_mysql')

const addRecette = require('./controllers/addRecette')

const bodyParser = require('body-parser')

// retrieve http module
const http = require('http')
// lire le fichier accueil
const accueil = fs.readFileSync(path.join(__dirname, 'Html', 'accueil.html'))
const accueil_image = fs.readFileSync(path.join(__dirname, 'Html', 'image.PNG'))
// on lit le fichier template
const resultat = fs.readFileSync(path.join(__dirname, 'Html', 'resultat.handlebars'))
// on lit la page recette - ici recette.html est le nom du fichier
const recette = fs.readFileSync(path.join(__dirname, 'Html', 'recette.handlebars'))
const ajoutRecette = fs.readFileSync(path.join(__dirname, 'Html', 'ajoutRecette.html'))

const confirmation = fs.readFileSync(path.join(__dirname, 'Html', 'confirmation.html'))
// module fs utilisé, j'appele une fonction pour lire le fichier
const style = fs.readFileSync(path.join(__dirname, 'Html', 'style.css'))
const styleRecette = fs.readFileSync(path.join(__dirname, 'Html', 'style_recette.css'))

// on utilise library qui va le mettre ready to be used - pas de résultats
const template_resultat = Handlebars.compile(resultat.toString())
// compilation du template
const template_recette = Handlebars.compile(recette.toString())

// create server with function, ce qu'il fait
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(`http://èlèl${req.url}`, true)
  // console.log(parsedUrl);
  if (req.url === '/') {
    res.write(accueil)
    res.end()
  } else if (req.url === '/image.PNG') {
    res.write(accueil_image)
    res.end()
  } else if (parsedUrl.pathname === '/resultat') {
    Mysql.getAllRecipies((results) => {
      const context = {
        lines: results
      }
      const html = template_resultat(context)
      res.write(html)
      res.end()
    }
    )
    // ici /recette ce n'est pas la page mais l'url - doit être identique à celle définit dans resultat.moustache
    // avec parsedUrl je n'ai que /recette qui est pris en compte dans url et pas l'id (search)
  } else if (parsedUrl.pathname === '/recette') {
    Mysql.getRecipie(parsedUrl.query.id, (results) => {
      const html = template_recette(results)
      res.write(html)
      res.end()
    }
    )
  } else if (parsedUrl.pathname === '/ajoutRecette') {
    res.write(ajoutRecette)
    res.end()

  } else if (parsedUrl.pathname === '/addRecette') {
    addRecette(req, res)
  }
  // style.css est une page , je l'appelle avec la variable style définie plus haut
  else if (req.url === '/style.css') {
    res.write(style)
    res.end()
  }

  // style.css est une page , je l'appelle avec la variable style définie plus haut
  else if (req.url === '/style_recette.css') {
    res.write(styleRecette)
    res.end()
  } else if (parsedUrl.pathname === '/suppressionRecette') {
    // parsedUrl.query.id permet de récupérer l'id de la recette
    Mysql.removeRecipie(parsedUrl.query.id, () => {
      //	console.log(req.body)
      res.write(confirmation)
      res.end()
    }
    )
  } else {
    res.statusCode = 404
    res.write('Wrong url')
    res.end()
  }
})
// start server
server.listen(8080)

