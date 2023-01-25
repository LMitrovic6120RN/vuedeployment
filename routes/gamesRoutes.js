const {sequelize, Games} = require('../models');
const {gamesSchema} = require('../helpers/validation/gamesSchema');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Games.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Games.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/category/:category', (req, res) => {
    try{
        Games.findAll({
            where: {category_game: req.params.category}
        }).then(rows=>res.json(rows)).catch(err=>res.json({msg: err}));
    }catch(err){
        return res.status(500).json({msg: err});
    }
});

route.get('/publisher/:publisher', (req, res) => {
    try{
        Games.findAll({
            where: {publisher_game: req.params.publisher}
        }).then(rows=>res.json(rows)).catch(err=>res.json({msg: err}));
    }catch(err){
        return res.status(500).json({msg: err});
    }
});

route.post('/', async (req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(403).json({msg: "No priveleges."})
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    console.log(token);
    if (payload.admin === false || payload.moderator === false)
        return res.status(403).json({msg: "You do not have the right priveleges for this operation."});
    try{
    const forValidation = {
        title: req.body.title,
        year: req.body.year,
        price : req.body.price,
    }
    await gamesSchema.validateAsync(forValidation, {abortEarly: false});
    let gameInfo = "No additional information supplied.";
    if (req.body.info != null) {
        gameInfo = req.body.info;
    }
    Games.create(req.body)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        let errorMessage = "";
        err.details.forEach(detail => {
            errorMessage = errorMessage + detail.message + "\n";
        });
        const data = {
            msg: errorMessage
        }
        console.log(data.msg);
        return res.status(400).json({msg: data.msg});
    }
});

route.delete('/:id', (req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(404).json({msg: "No priveleges."})
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    console.log(token);
    if (payload.admin === false || payload.moderator === false)
        res.status(403).json({msg: "Not moderator nor admin!"});
    else {
        Games.findByPk(req.params.id)
            .then(game => {
                game.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json(err));
    }
});

route.put('/:id', async(req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(403).json({msg: "No priveleges."})
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    console.log(token);
    if (payload.admin === false || payload.moderator === false)
        return res.status(403).json({msg: "Not admin/mmoderator!"});
    try {
        const forValidation = {
            username: req.body.username
        }
        await updateSchema.validateAsync(forValidation, {abortEarly: false});
        Users.findByPk(req.params.id)
            .then(user => {
                user.username = req.body.username,
                user.admin = req.body.admin,
                user.moderator = req.body.moderator
                user.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch (err){
        let errorMessage = "";
        err.details.forEach(detail => {
            errorMessage = errorMessage + detail.message + "\n";
        });
        const data = {
            msg: errorMessage
        }
        console.log(data.msg);
        return res.status(400).json({msg: data.msg});
    }
});

module.exports = route;