const {sequelize, Wishlist} = require('../models');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Wishlist.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Wishlist.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/user/:user', (req, res) => {
    Wishlist.findAll({
        where: {user_wishlist: req.params.user}
    }).then(rows=>res.json(rows)).catch(err=>res.status(500).json({msg: err}));
});

route.post('/', async (req, res) => {
    /*
    Wishlist.create(req.body)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
        */
        try{
            let wishlist = await Wishlist.create(req.body);
            res.send(wishlist);
        } catch (err){
            console.log(err);
            res.status(422).json({msg: err});
        }
});

route.put('/:id', (req, res) => {
    try{
        Wishlist.findByPk(req.params.id)
            .then(wishlist => {
                wishlist.usersId = req.body.usersId,
                wishlist.gamesId = req.body.gamesId
                wishlist.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(400).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }

});

route.delete('/:id', (req, res) => {
    try{
        Wishlist.findByPk(req.params.id)
            .then(wishlist => {
                wishlist.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(400).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

route.delete('/game/:game/:user', (req, res) => {
    try{
        Wishlist.findOne({
            where: {user_wishlist: req.params.user, game_wishlist: req.params.game}
        }).then(wl => {
            wl.destroy().then(rows=>res.json(rows)).catch(err=>res.status(500).json({msg: err}));
        })
    }catch(err){
        return res.status(400).json({msg: err});
    }
});

module.exports = route;
