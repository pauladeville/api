# Projet n°6 "Construire une API sécurisée"

Marche à suivre pour utiliser l'API :

1. Clonez ce repository

## Mongo DB

2. Créer votre propre cluster sur [`Mongo Atlas`](https://www.mongodb.com/fr)

3. Créez un fichier .env à la racine du projet, et y indiquer vos identifiants MongoDB
	* `DB_USER=< votre nom d'utilisateur >`
	* `DB_PASSWORD=< votre mot de passe >`
	* `DB_NAME=< le nom de votre cluster >`
	
4. Ajouter une longue chaîne de caractères aléatoires pour configurer les tokens utilisateurs
	* `SECRET_TOKEN=< votre chaîne de caractères>`

## Backend

5. Depuis le dossier backend, téléchargez Node.js puis tapez la commande suivante : `npm start`.

6. Lancez le serveur avec la commande : `node server`.

Le serveur doit fonctionner sur [`http://localhost:3000/`](http://localhost:3000/).

## Frontend

7. Depuis le dossier frontend, installez node-sass.

8. Lancez le serveur de développement avec la commande : `ng serve`

Rendez-vous sur [`http://localhost:4200/`](http://localhost:4200/) avec votre navigateur.
