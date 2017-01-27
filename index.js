//fonction entre autre pour lire les fichiers avec fs
const fs = require('fs');
const path = require('path');
const url = require('url');

//charge module handlebars
const Handlebars = require('handlebars');

// charger mon module mysql, indiquer le nom du fichier 
const Mysql = require('./script_mysql');

const bodyParser = require('body-parser')

//retrieve http module
const http = require('http');
//lire le fichier accueil
const accueil = fs.readFileSync(path.join(__dirname, 'Html', 'accueil.html'));
const accueil_image = fs.readFileSync(path.join(__dirname, 'Html', 'image.png'));
//on lit le fichier template 
const resultat = fs.readFileSync(path.join(__dirname, 'Html', 'resultat.moustache'));
//on lit la page recette - ici recette.html est le nom du fichier
const recette = fs.readFileSync(path.join(__dirname, 'Html', 'recette.moustache'));
const ajoutRecette = fs.readFileSync(path.join(__dirname, 'Html', 'ajoutRecette.html'));

//on utilise library qui va le mettre ready to be used - pas de résultats 
const template_resultat = Handlebars.compile(resultat.toString());
// compilation du template
const template_recette = Handlebars.compile(recette.toString());




//create server with function, ce qu'il fait
const server = http.createServer((req, res) => {
	const parsedUrl = url.parse('http://èlèl' + req.url, true);
	//console.log(parsedUrl);
	if (req.url === '/') {
		res.write(accueil);
		res.end();

	} else if (req.url === '/image.png') {
		res.write(accueil_image);
		res.end();



	} else if (req.url === '/resultat') {
		Mysql.getAllRecipies(function (results) {
			const context = {
				lines: results
			};
			const html = template_resultat(context);
			res.write(html);
			res.end();
		}
		)


		// ici /recette ce n'est pas la page mais l'url - doit être identique à celle définit dans resultat.moustache
		// avec parsedUrl je n'ai que /recette qui est pris en compte dans url et pas l'id (search)
	} else if (parsedUrl.pathname === '/recette') {
		Mysql.getRecipie(parsedUrl.query.id, function (results) {
			const html = template_recette(results);
			res.write(html);
			res.end();
		}
		)
	} else if (parsedUrl.pathname === '/ajoutRecette') {
		res.write(ajoutRecette);
		res.end();

	} else if (req.url === '/addRecette') {
		//on veut communiquer avec la base les valeurs étant dans la requete - donc récupérer les infos de la requete pour les envoyer à la base.

		//retourne une fonction qui prend 3 param.: req. http, res.http,callback
		//sert à extraire le body du reste.
		const parseBody = bodyParser.urlencoded({ extended: false })
		//parseBody est asynchrone, quand il rend la main il n'a pas été exe. callback est appelé quand réellement parseBody aura fini de faire le travail
		parseBody(req, res, function () {
			// je vois le body qui est extrait dans cmd (log du serveur!)
			console.log(req.body);
			//function() = function de mon callback : je veux que ca termine le requete http donc res.write et res.end
			//je mets Mysql devant le nom de la fonction que j'appelle car la fonction a été défini dans un autre module définit par la variable Mysql
			Mysql.addRecipie(req.body.Nom, req.body.Description, req.body.Type, function (recetteId) {
				let ingredients, quantites, unites
				if (req.body.addIngredients === undefined)			
					{// j'exe addIngredient. si on a 0 ingrédient on veut que rien ne se fasse
						ingredients = []
						quantites = []
						unites = []
					}
				else if (Array.isArray(req.body.Ingrédient)) {
					// j'exe addIngredients
					ingredients = req.body.Ingrédient
					quantites = req.body.Quantité
					unites = req.body.Unité
				}

				else {// j'exe addIngredient. si on a qu'1 ingrédient on transforme la valeur en tableau et on met le résultat dans notre variable
					ingredients = [req.body.Ingrédient]
					quantites = [req.body.Quantité]
					unites = [req.body.Unité]
				}
				// j'utilise la fonction dans la suite
				Mysql.addIngredients(ingredients, function () {
					Mysql.addQuantitesUnites(recetteId, ingredients, quantites, unites, function () {
						//	console.log(req.body);	
						res.write('enregistrement fini')
						res.end();
					})
				})
			})




		})


	}

	else {
		res.write('Wrong url');
		res.end();
	}

});
//start server
server.listen(8080);


