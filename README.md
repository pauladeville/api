# Projet n°6 "Construire une API sécurisée"

Marche à suivre pour utiliser l'API :

1. Clonez ce repository

## Mongo DB

2. Créez un fichier .env à la racine du dossier backend, et y indiquer les accès au cluster MongoDB
	* `DB_USER=sopekocko`
	* `DB_PASSWORD=devweb2020`
	* `DB_NAME=sopekocko`
	
3. Ajouter une longue chaîne de caractères aléatoires pour configurer les tokens utilisateurs
	* `SECRET_TOKEN=< votre chaîne de caractères>`

## Backend

4. Installez les packages nécessaires au bon fonctionnement de l'API avec la commande `npm install --save <nom du package>` :
	* `express`
	* `mongoose`
	* `body-parser`
	* `path`
	* `helmet`
	* `dotenv`
	* `mongoose-unique-validator`
	* `jsonwebtoken`
	* `multer`
	* `bcrypt`
	* `email-validator`
	* `password-validator`
	* `mongo-sanitize`
	* `fs`
	
5. Lancez le serveur avec la commande : `node server`.

Le serveur doit fonctionner sur [`http://localhost:3000/`](http://localhost:3000/) et Node.js doit être installé sur votre machine.

## Frontend

6. Depuis le dossier frontend, installez node-sass avec la commande `npm install --save node-sass`.

7. Lancez le serveur de développement avec la commande : `ng serve`.

Rendez-vous sur [`http://localhost:4200/`](http://localhost:4200/) avec votre navigateur.
