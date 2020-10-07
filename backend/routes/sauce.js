//Importation du framework, du contrôleur sauce et création d'un routeur Express
const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");

//Importation des middleware d'authentification et de gestion des fichiers entrants
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//Application des fonctions pour chaque route + authentification pour toutes les routes + gestion des fichiers entrants pour les routes concernées (post / put)
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.rateSauce);

//Exportation du router
module.exports = router;


