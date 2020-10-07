const jwt = require("jsonwebtoken");
const Sauce = require("../models/Sauce");
const multer = require("../middleware/multer-config");
const fs = require("fs");
const dotenv = require("dotenv").config();

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: "Sauce ajoutée"}))
        .catch(error => res.status(400).json({error}))
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    Sauce.updateOne({_id: req.params.id}, {...sauceObject})
        .then(() => res.status(200).json({message: "Sauce modifiée"}))
        .catch(error => res.status(400).json({error}))
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split("/image/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: "Sauce supprimée"}))
                    .catch(error => res.status(400).json({error}));
            })
        })
        .catch(error => res.status(400).json({error}))
};

exports.rateSauce = (req, res, next) => {
    if(req.body.like === 1){
        Sauce.updateOne(
            {_id: req.params.id},
            {$inc: {likes: +1}, $push: {usersLiked: req.body.userId}}
        )
            .then(() => {
                res.status(200).json({message: "Like comptabilisé"})
            })
            .catch(error => res.status(400).json({error}))
    } else if(req.body.like === -1){
        Sauce.updateOne(
            {_id: req.params.id},
            {$inc: {dislikes: +1}, $push: {usersDisliked: req.body.userId}}
        )
            .then(() => {
                res.status(200).json({message: "Dislike comptabilisé"})
            })
            .catch(error => res.status(400).json({error}))
    } else if(req.body.like === 0){
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if(sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne(
                        {_id: req.params.id},
                        {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}}
                    )
                    .then(() => res.status(200).json({message: "Note annulée"}))
                    .catch(error => res.status(400).json({error}))
                } else if(sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne(
                        {_id: req.params.id},
                        {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}}
                    )
                    .then(() => res.status(200).json({message: "Note annulée"}))
                    .catch(error => res.status(400).json({error}))
                }

            })
            .catch(error => res.status(400).json({error}))
    }
};