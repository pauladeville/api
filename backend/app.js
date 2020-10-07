//Importation du framework et packages nécessaires
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");

//Importation du module dotenv
require("dotenv").config();

//Routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce")

//Connexion au cluster MongoDB (en masquant les données sensibles avec dotenv)
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@sopekocko.i92vl.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {useNewUrlParser: true,
    useUnifiedTopology: true })
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch(() => console.log('Connexion à MongoDB échouée !'));  

//Lancement de l'application express
const app = express();

//Helmet middleware pour sécuriser les headers
app.use(helmet());

//Configuration des headers pour autoriser les requêtes depuis un autre serveur (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
 });

 //Transformation des requêtes en objets JavaScript utilisables
app.use(bodyParser.json());

//Dossier images statique (avec un path dynamique)
app.use("/images", express.static(path.join(__dirname, "images")));

//Enregistrement des routes associées aux endpoints attendus
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;