//Importation du package Mongoose et mongoose-unique-validator
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//Création du schéma de données pour tous les users qui s'enregistrent
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//Plugin empêchant à une même adresse d'être utilisée 2 fois (double sécurité en plus de la valeur unique dans le champ email du schéma)
userSchema.plugin(uniqueValidator);

//Exportation du modèle
module.exports = mongoose.model("User", userSchema);
