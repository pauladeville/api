//Importation du package de gestion des token
const jwt = require("jsonwebtoken");

//Fonction d'authentification des requêtes
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]; //Récupération du token dans le header authorization (suppression du mot clé bearer)
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); //Décodage du token en objet JS
        const userId = decodedToken.userId; //Extraction du userId depuis le token décodé
        //Si l'userId contenu par le token ne correspond pas au userId de la requête, renvoie d'une erreur, sinon next passe l'exécution au middleware suivant 
        if(req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID"
        } else {
            next();
        }
    }
    catch (error) {
        res.status(401).json({error})
    }
};