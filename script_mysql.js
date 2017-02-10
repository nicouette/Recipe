// module pour communiquer avec mysql
const mysql = require('mysql')

function exeQuery (query, values, callback) {
  // creer un objet connection
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sb',
    password: 'toto',
    database: 'recettes'
  })

  connection.config.queryFormat = function (query, values) {
    if (!values) return query
    return query.replace(/\:(\w+)/g, (txt, key) => {
      if (values.hasOwnProperty(key)) {
        return this.escape(values[key])
      }
      return txt
    })
  }

  // etablir connection
  connection.connect()

  connection.query(query, values, (error, results, fields) => {
    if (error) throw error
    // console.log('The solution is: ', results);
    callback(results)
  })

  connection.end()
}

// je cree une fonction pour recuperer toutes les recettes - je l'appellerai dans index.js
// callback permet de retourner les résultats

function getAllRecipies (callback) {
  exeQuery('select * from recettes', undefined, callback)
}

// fonction pour récupérer une recette spécifique et pouvoir l'afficher
function getRecipie (id, callback) {
  const results = {}
  // on veut échapper le resultat de la query (caractères spéciaux) alors on utilise id=:id, {id} qui est le paramètre Values de exeQuery l.4
  exeQuery('select id, nom, description from recettes where id =:id', {id}, (resSelectedRecette) => {
    results.id = resSelectedRecette[0].id
    results.nom = resSelectedRecette[0].nom
    results.description = resSelectedRecette[0].description
    // query pour pouvoir afficher les ingrédients, quantité et unité associés
    exeQuery('select nom,quantité,unité from ingredients join recettes_ingredients on id=ingredient_id where recette_id=:id', {id}, (resSelectedIngredient) => {
      results.ingredients = resSelectedIngredient
      exeQuery('select id, titre, description, objet_id from commentaires where objet_id=:id AND type=\'recette\'', {id}, (resSelectedComment) => {
        results.comments = resSelectedComment
        console.log(results)
        callback(results)
      }
      )
    }
    )
  })
}
function addRecipie (nom, description, type, callback) {
  // exeQuery a 2 parameters: la query - ici un insert et le callback -pour me dire que c'est fini
  // quand dans le code on rencontre nom, description , type , on remplace par ce qu'il y a dans le paramètre values soit les variables
  exeQuery('insert into Recettes (nom,description,type) Values(:nom,:description,:type)', {nom, description, type}, (results) => {
    callback(results.insertId)
  })
}

function addIngredients (noms, callback) {
  // on ne peut pas faire un for mais l'idée y est - on va utiliser une fonction récursive (fonction qui s'appelle elle-même)
  // on insére le 1er élément de la ligne, ensuite il reste le reste. on insére le 1er élément du reste il reste le reste
  if (noms.length > 0) {
    addIngredient(noms[0], () => {
      // slice(1) retire le 1er élément donc pour nous [0] . à chaque fois on va retirer la 1ere ligne de notre tableau
      // dans addIngredient j'appelle addIngredients créant ainsi une grande boucle.
      // on met callback car dans addIngredients on a 2 param. mais en fait callback ne fait rien. on a un vrai callback à la fin
      addIngredients(noms.slice(1), callback)
    })
  } else {
    callback()
  }
}

function addIngredient (nom, callback) {
  // exeQuery pour inserer les données dans la table ingrédients

  const queryIngredient = 'insert ignore into Ingredients (nom) Values (:nom)'
  console.log(queryIngredient)
  exeQuery(queryIngredient, {nom}, callback)
}

function addQuantiteUnite (recetteId, nomIngredient, quantite, unite, callback) {
  exeQuery(`insert into recettes_ingredients (recette_id,ingredient_id,quantité,unité)
VALUES (:recetteId,(select id from ingredients WHERE nom=:nomIngredient),:quantite,:unite)`, {recetteId, nomIngredient, quantite, unite}, callback)
}

function addQuantitesUnites (recetteId, nomIngredients, quantites, unites, callback) {
  // on ne peut pas faire un for mais l'idée y est - on va utiliser une fonction récursive (fonction qui s'appelle elle-même)
  // on insére le 1er élément de la ligne, ensuite il reste le reste. on insére le 1er élément du reste il reste le reste
  if (nomIngredients.length > 0) {
    // on insére des quantités et unités lié à 1 recette donc pas de tableau pour recette, on ne parle que d'une seule recette
    addQuantiteUnite(recetteId, nomIngredients[0], quantites[0], unites[0], () => {
      // slice(1) retire le 1er élément donc pour nous [0] . à chaque fois on va retirer la 1ere ligne de notre tableau
      // dans addIngredient j'appelle addIngredients créant ainsi une grande boucle.
      // on met callback car dans addIngredients on a 2 param. mais en fait callback ne fait rien. on a un vrai callback à la fin
      addQuantitesUnites(recetteId, nomIngredients.slice(1), quantites.slice(1), unites.slice(1), callback)
    })
  } else {
    callback()
  }
}

function removeRecipie (id, callback) {
  exeQuery('delete from recettes_ingredients where recette_id=:id', {id}, () => {
   // console.log('tu as perdu')
    exeQuery('delete from commentaires where objet_id=:id AND type=\'recette\'', {id}, () => {
      exeQuery('delete from recettes where id=:id', {id}, callback)
      // ajouter la suppression du commentaire(s) associé(s)
    }
    )
  }
  )
}

function addComment (titre, description, type, objetId, callback) {
  exeQuery('insert into commentaires(titre,description,type,objet_id) VALUES (:titre,:description,:type,:objetId)', {titre, description, type, objetId}, callback)
}

function removeComments (id, callback) {
  exeQuery('delete from commentaires where id=:id', {id}, callback)
}

module.exports = {
  getAllRecipies, getRecipie, addRecipie, addIngredient, addIngredients, addQuantiteUnite, addQuantitesUnites, removeRecipie, addComment, removeComments
}

