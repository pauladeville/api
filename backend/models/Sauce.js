//Importation du package Mongoose
const mongoose = require("mongoose");

//Création du schéma de données pour tous les objets sauce à créer
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}
});

//Exportation du modèle
module.exports = mongoose.model("Sauce", sauceSchema);