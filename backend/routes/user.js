//Importation du framework, du contrôleur user et création d'un routeur Express
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//Application des fonctions pour chaque route
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//Exportation du router
module.exports = router;