//Importation des packages filesystem et mongo-sanitize
const sanitize = require("mongo-sanitize");
const fs = require("fs");

//Importation du modèle Sauce
const Sauce = require("../models/Sauce");

//Création d'une nouvelle sauce (route POST)
exports.createSauce = (req, res, next) => {
    //Création d'un objet sauce avec les valeurs du corps de la requête
    const sauceObject = JSON.parse(sanitize(req.body.sauce));
    const sauce = new Sauce({
        ...sauceObject,
        //Recontruction de l'URL de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: "Sauce ajoutée"}))
        .catch(error => res.status(400).json({error}))
};

//Renvoi de toutes les sauces présentes dans la BDD (route GET)
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
};

//Renvoi de la sauce dont l'ID correspond à celui présent dans l'URI de la requête (route GET)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
};

//Modification d'une sauce (route PUT)
exports.modifySauce = (req, res, next) => {
    //Si la requête contient un fichier, récupérer l'objet et reconstruire l'imageUrl
    const sauceObject = req.file ?
    {
        ...JSON.parse(sanitize(req.body.sauce)),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body //Sinon récupérer les valeurs dans le corps de la requête
    }
    //Remplacer les valeurs de l'objet sauce stocké dans la BDD par les nouvelles valeurs
    Sauce.updateOne({_id: req.params.id}, {...sauceObject})
        .then(() => res.status(200).json({message: "Sauce modifiée"}))
        .catch(error => res.status(400).json({error}))
};

//Suppression de la sauce + de l'image associée (route DELETE)
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            //Reconstruire le nom du fichier image à partir de son URL et la supprimer dans le filesystem
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, (error) => {
                if (error) throw error;
            })
            //Suppression de la sauce dont l'id correspond à celui dans l'URI de la requête
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce supprimée"}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(400).json({error}))
};

//Gestion des mentions "j'aime" 
exports.rateSauce = (req, res, next) => {
    //Statut like dans la requête = 1 --> ajout d'1 like, ajout de l'userId contenu dans la requête dans l'array usersLiked
    if(req.body.like === 1){
        Sauce.updateOne(
            {_id: req.params.id},
            {
                $inc: {likes: +1},
                $push: {usersLiked: req.body.userId}
            })
            .then(() => res.status(200).json({message: "Like comptabilisé"}))
            .catch(error => res.status(400).json({error}))
    //Statut like = 0 --> ajout d'1 dislike, ajout de l'userId contenu dans la requête dans l'array usersDisliked
    } else if(req.body.like === -1){
        Sauce.updateOne(
            {_id: req.params.id}, 
            {
                $inc: {dislikes: +1}, 
                $push: {usersDisliked: req.body.userId}
            })
            .then(() => res.status(200).json({message: "Dislike comptabilisé"}))
            .catch(error => res.status(400).json({error}))
    //Statut like = 0, retirer la note précédemment laissée par l'user
    } else if(req.body.like === 0){
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                //Si l'userId est présent dans l'array usersLiked, le retirer + retirer 1 like
                if(sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne(
                        {_id: req.params.id}, 
                        {
                            $pull: {usersLiked: req.body.userId}, 
                            $inc: {likes: -1}
                        })
                    .then(() => res.status(200).json({message: "Note annulée"}))
                    .catch(error => res.status(400).json({error}))
                //Si l'userId est présent dans l'array usersDisliked, le retirer + retirer 1 dislike
                } else if(sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne(
                        {_id: req.params.id},
                        {
                            $pull: {usersDisliked: req.body.userId},
                            $inc: {dislikes: -1}
                        })
                    .then(() => res.status(200).json({message: "Note annulée"}))
                    .catch(error => res.status(400).json({error}))
                }

            })
            .catch(error => res.status(400).json({error}))
    }
};