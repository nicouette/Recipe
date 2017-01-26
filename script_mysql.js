//module pour communiquer avec mysql
const mysql = require('mysql');

function exeQuery(query, callback) {
  //creer un objet connection 
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sb',
    password: 'toto',
    database: 'recettes'
  });
  //etablir connection
  connection.connect();

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    callback(results);
  });

  connection.end();

}

//je cree une fonction pour recuperer toutes les recettes - je l'appellerai dans index.js
// callback permet de retourner les résultats


function getAllRecipies(callback) {
exeQuery('select * from recettes',callback)
}


function getRecipie(id, callback) {
  const results = {}
  exeQuery('select nom, description from recettes where id =' + id, function (resSelectedRecette){
    results.nom = resSelectedRecette[0].nom
    results.description = resSelectedRecette[0].description
    exeQuery('select nom,quantité,unité from ingredients join recettes_ingredients on id=ingredient_id where recette_id=' + id, function(resSelectedIngredient){
      results.ingredients = resSelectedIngredient
    callback(results)
    }
    )
  })
}

module.exports = {
  getAllRecipies, getRecipie
};

