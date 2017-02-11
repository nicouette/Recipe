const bodyParser = require('body-parser')
const Mysql = require('../script_mysql')

function addRecette (req, res) {
// on veut communiquer avec la base les valeurs étant dans la requete - donc récupérer les infos de la requete pour les envoyer à la base.

  // retourne une fonction qui prend 3 param.- req. http, res.http,callback
  // sert à extraire le body du reste.
  const parseBody = bodyParser.urlencoded({extended: false})
  // parseBody est asynchrone-je recupere des elements de la requete http, quand il rend la main il n'a pas été exe. callback est appelé quand réellement parseBody aura fini de faire le travail
  parseBody(req, res, () => {
    // je vois le body qui est extrait dans cmd (log du serveur!)
    // console.log(req.body)
    // function() = function de mon callback -je veux que ca termine le requete http donc res.write et res.end
    // je mets Mysql devant le nom de la fonction que j'appelle car la fonction a été défini dans un autre module définit par la variable Mysql
    Mysql.addRecipie(req.body.Nom, req.body.Description, req.body.Type, (recetteId) => {
      let ingredients
      let quantites
      let unites
      if (req.body.Ingrédient === undefined) { // j'exe addIngredient. si on a 0 ingrédient on veut que rien ne se fasse
        ingredients = []
        quantites = []
        unites = []
      } else if (Array.isArray(req.body.Ingrédient)) {
        // j'exe addIngredients
        ingredients = req.body.Ingrédient
        quantites = req.body.Quantité
        unites = req.body.Unité
      } else { // j'exe addIngredient. si on a qu'1 ingrédient on transforme la valeur en tableau et on met le résultat dans notre variable
        ingredients = [req.body.Ingrédient]
        quantites = [req.body.Quantité]
        unites = [req.body.Unité]
      }
      // j'utilise la fonction dans la suite
      Mysql.addIngredients(ingredients, () => {
        Mysql.addQuantitesUnites(recetteId, ingredients, quantites, unites, () => {
          // console.log(req.body)
          res.writeHead(302, {
            Location: `/recette?id=${recetteId}`
          // add other headers here...
          })
          res.end()
        }
        )
      })
    }
    )
  }
  )
}

module.exports = addRecette
