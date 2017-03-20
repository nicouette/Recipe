const path = require('path')
const fs = require('fs')

// module pour communiquer avec mysql
const sqlite = require('sqlite3').verbose()
// on ouvre "la connection" au fichier de base de données
// const db = new sqlite.Database(path.join(__dirname, 'sqlite', 'projet_recette.sqlite'))
// || est un ou, si le 1er argument n'est pas ok je prends le 2nd
// console.log(process.env.DB_URL)
const db = new sqlite.Database(process.env.DB_URL || path.join(__dirname, 'sqlite', 'projet_recette.sqlite'))
// à ce niveau, la base est vierge, on doit s'assurer de créer les tables
const createTables = fs.readFileSync(path.join(__dirname, 'sqlite', 'script.sql'))
db.exec(createTables.toString())

// exeQuery appelle db.run. dans le callback on définit quoi faire en cas d'erreurs
function exeQuery (query, values, callback) {
  db.all(query, values, (error, results) => {
    if (error) throw error
    // console.log('The solution is: ', results)
    callback(results)
  })
}

function insertQuery (query, values, callback) {
  db.run(query, values, function result (error) {
    if (error) throw error
    // console.log('The solution is: ', results)
    // this représente le contexte de la fonction
    callback(this.lastID)
  })
}

// je cree une fonction pour recuperer toutes les recettes - je l'appellerai dans index.js
// callback permet de retourner les résultats
// $nom:`%${nom}%`:une template string pour string dans laquelle je mets des paramètres pour aller chercher des valeurs des variables. pour paramètriser j'ai mis${}
// c'est compliqué
function getRecipes (nom, type, callback) {
  let query = 'select * from recettes'
  let params = {}
  if (nom !== '' && type !== '') {
    query += ' where nom LIKE $nom AND type =$type'
    params = {$nom: `%${nom}%`, $type: type}
  } else if (type !== '') {
    query += ' where type =$type'
    params = {$type: type}
  } else if (nom !== '') {
    query += ' where nom LIKE $nom'
    params = {$nom: `%${nom}%`}
  }
  exeQuery(query, params, callback)
}

// fonction pour récupérer une recette spécifique et pouvoir l'afficher
function getRecipe (id, callback) {
  const results = {}
  // on veut échapper le resultat de la query (caractères spéciaux) alors on utilise id=:id, {id} qui est le paramètre Values de exeQuery l.4
  exeQuery('select id, nom, description, type from recettes where id =$id', {$id: id}, (resSelectedRecette) => {
    results.id = resSelectedRecette[0].id
    results.nom = resSelectedRecette[0].nom
    results.description = resSelectedRecette[0].description
    results.type = resSelectedRecette[0].type
    // query pour pouvoir afficher les ingrédients, quantité et unité associés
    exeQuery('select nom,quantité,unité from ingredients join recettes_ingredients on id=ingredient_id where recette_id=$id', {$id: id}, (resSelectedIngredient) => {
      results.ingredients = resSelectedIngredient
      exeQuery("select id, titre, description, objet_id from commentaires where objet_id=$id AND type='recette'", {$id: id}, (resSelectedComment) => {
        results.comments = resSelectedComment
        // console.log(results)
        callback(results)
      }
      )
    }
    )
  })
}
function addRecipe ($nom, $description, $type, callback) {
  // exeQuery a 2 parameters: la query - ici un insert et le callback -pour me dire que c'est fini
  // quand dans le code on rencontre nom, description , type , on remplace par ce qu'il y a dans le paramètre values soit les variables
  insertQuery('insert into Recettes (nom,description,type) Values($nom,$description,$type)', {$nom, $description, $type}, (insertId) => {
    // console.log(insertId)
    callback(insertId)
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

function addIngredient ($nom, callback) {
  // exeQuery pour inserer les données dans la table ingrédients

  const queryIngredient = 'insert or ignore into Ingredients (nom) Values ($nom)'
  // console.log(queryIngredient)
  exeQuery(queryIngredient, {$nom}, callback)
}

function addQuantiteUnite ($recetteId, $nomIngredient, $quantite, $unite, callback) {
  exeQuery(`insert into recettes_ingredients (recette_id,ingredient_id,quantité,unité)
VALUES ($recetteId,(select id from ingredients WHERE nom=$nomIngredient),$quantite,$unite)`, {$recetteId, $nomIngredient, $quantite, $unite}, callback)
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

function updateRecipe ($id, $nom, $description, $type, callback) {
  exeQuery('update recettes set nom=$nom,description=$description,type=$type where id=$id', {$nom, $description, $type, $id}, callback)
}

function removeRecipie ($id, callback) {
  exeQuery('delete from recettes_ingredients where recette_id=$id', {$id}, () => {
    // console.log('tu as perdu')
    exeQuery("delete from commentaires where objet_id=$id AND type='recette'", {$id}, () => {
      exeQuery('delete from recettes where id=$id', {$id}, callback)
    // ajouter la suppression du commentaire(s) associé(s)
    }
    )
  }
  )
}

function addComment ($titre, $description, $type, $objetId, callback) {
  exeQuery('insert into commentaires(titre,description,type,objet_id) VALUES ($titre,$description,$type,$objetId)', {$titre, $description, $type, $objetId}, callback)
}

function removeComments ($id, callback) {
  exeQuery('delete from commentaires where id=$id', {$id}, callback)
}

module.exports = {getRecipe, addRecipe, addIngredient, addIngredients, addQuantiteUnite, addQuantitesUnites, removeRecipie, addComment, removeComments, getRecipes, updateRecipe}
