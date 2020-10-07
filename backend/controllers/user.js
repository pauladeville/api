//Importation des packages nécessaires
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator")
const emailValidator = require("email-validator");
const sanitize = require("mongo-sanitize");

//Importation du modèle User
const User = require("../models/User");

//Création du schéma de mot de passe
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(6) // 6 caractères min
    .is().max(20) // 12 caractères max
    .has().uppercase() // Au moins 1 majuscule
    .has().lowercase() // Au moins 1 minuscule
    .has().digits(1) // Au moins 1 chiffre
    .has().not().spaces() // Pas d'espace

//Fonction d'inscription
exports.signup = (req, res, next) => {
    //Si l'email-validator, le password-validator ou mongo-sanitize ne renvoie pas true, envoi d'une erreur
    if(!emailValidator.validate(sanitize(req.body.email)) || !passwordSchema.validate(sanitize(req.body.password))) {
        return res.status(400).json({message: "Veuillez vérifier votre adresse email et votre mot de passe qui doit contenir au moins 6 caractères, 1 majuscule et 1 chiffre"})
    } else {
    //Si les champs passent la validation des packages, hashage x10 du mdp, création de l'objet user, sauvegarde dans la BDD
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: "Utilisateur créé"}))
                .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}))
    }    
};

//Fonction de connexion
exports.login = (req, res, next) => {
    //Recherche dans la BDD d'un user avec le même email
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                return res.status(404).json({error})
            }
            //S'il existe, bcrypt compare le mdp de la requête du mdp stocké
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({error});
                    }
                    //Si valide, création du token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.SECRET_TOKEN,
                            {expiresIn: "24h"}
                        )
                    })
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
};