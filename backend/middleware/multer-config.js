//Importation du package multer
const multer = require("multer");

//Objet servant de traducteur pour passer du MIME à l'extention
const MIME_TYPES = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png"
}

//Configuration de la destination (dossier images) et du nom du fichier reçu (nom d'origine sans les espaces + la date + l'extension)
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    }
});

//Exportation du middleware multer configuré
module.exports = multer({storage: storage}).single("image");