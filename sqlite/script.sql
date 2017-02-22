CREATE TABLE IF NOT EXISTS RECETTES(
id INTEGER PRIMARY KEY AUTOINCREMENT,
nom VARCHAR(200) NOT NULL,
type VARCHAR (20) NOT NULL,
description TEXT
)
;

CREATE TABLE IF NOT EXISTS INGREDIENTS(
id INTEGER PRIMARY KEY AUTOINCREMENT,
nom VARCHAR(40) NOT NULL
)
;

CREATE TABLE IF NOT EXISTS COMMENTAIRES (
id INTEGER PRIMARY KEY AUTOINCREMENT,
titre VARCHAR(40) NOT NULL,
description TEXT,
type VARCHAR (20) NOT NULL,
objet_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS RECETTES_INGREDIENTS(
ingredient_id INTEGER NOT NULL,
recette_id INTEGER NOT NULL,
quantité INTEGER NOT NULL,
unité VARCHAR (30),
PRIMARY KEY (recette_id,ingredient_id),
foreign key (ingredient_id) references ingredients(id),
foreign key (recette_id) references recettes(id)
)
;

CREATE TABLE IF NOT EXISTS PHOTO (
id INTEGER PRIMARY KEY AUTOINCREMENT,
recette_id INTEGER NOT NULL
);