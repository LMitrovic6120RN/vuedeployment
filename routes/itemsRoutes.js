const {sequelize, Items, Cart} = require('../models');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Items.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Items.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/cart/:cart', (req, res) => {
    Items.findAll({
        where: {cart_item: req.params.cart}
    }).then(rows=>res.json(rows))
        .catch(err=>res.json({msg: err}));
});

route.delete('/gamecart/:game/:cart', (req, res) => {
    Items.findOne({
        where: {game_item: req.params.game, cart_item: req.params.cart}
    }).then(item => {
        Cart.findOne({where: {id: item.cart_item}})
        .then( cart => {
            cart.to_pay -= item.price;
            if (cart.to_pay <= 0) cart.to_pay = 0;
            cart.save();
            item.destroy()
            .then(rows => res.json(rows))
            .catch(err => res.status(500).json(err));
        });  
    })
    .catch(err => res.json({msg: err}));
});

route.post('/', (req, res) => {
    try{
        Items.create(req.body)
            .then(rows => {
                Cart.findOne({where: {id: req.body.cart_item}}).then(cart => {
                    cart.to_pay += req.body.price;
                    cart.save();
                });
            })
            .catch(err => res.status(500).json({msg: JSON.stringify(err)}));
    } catch(err){
        return res.status(400).json({msg: JSON.stringify(err)});
    }
});

route.put('/:id', async (req, res) => {
    try{
        Items.findByPk(req.params.id)
            .then(item => {
                item.quantity = req.body.quantity,
                item.price = req.body.price,
                item.cart_item = req.body.cart_item,
                item.game_item = req.body.game_item,
                item.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json(err));
    } catch(err){
        return res.status(400).json(err);
    }
});

route.delete('/:id', (req, res) => {
    try {
        Items.findByPk(req.params.id)
            .then(item => {
                Cart.findOne({
                    where: {id: item.cart_item}
                }).then(cart => {
                    cart.to_pay -= item.price;
                    cart.save();
                    item.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json(err));
                });
            })
            .catch(err => res.status(500).json(err));
        
    } catch(err){
        return res.status(400).json(err);
    }
});

route.delete('/game/:game_item', (req, res) => {
    try{
        Items.findOne({
            where: {game_item: req.params.game_item}
        }).then(item => {
            item.destroy().then(rows=>res.json(rows)).catch(err=>res.status(500).json(err));
        }).catch(err=>res.status(500).json(err));
    } catch(err){
        return res.status(500).json(err);
    }
});

module.exports = route;
