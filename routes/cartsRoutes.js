const {sequelize, Cart} = require('../models');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Cart.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/user/:user', async (req, res) =>{
    Cart.findAll({
        where: {user_cart: req.params.user}
    }).then(rows => res.json(rows))
        .catch(err=>res.json({msg: err}));
});

route.get('/:id', (req, res) => {
    Cart.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.post('/', async (req, res) => {
    try{
       await Cart.create(req.body)
            .then(rows => res.json({added: rows, body: req.body}))
            .catch(err => res.status(500).json({err: err, msg: req.body}));
    } catch(err){
        return res.status(400).json({err: err, msg: req.body});
    }
});

route.put('/:id', async (req, res) => {
    try{
        Cart.findByPk(req.params.id)
            .then(cart => {
                cart.to_pay = req.body.to_pay,
                cart.user_cart = req.body.user_cart,
                cart.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

route.put('/user/:user', (req, res) => {
    try{
        Cart.findOne({
            where: {user_cart: req.params.user}
        }).then(cart => {
            cart.to_pay = req.body.to_pay,
            cart.user_cart = req.body.user_cart,
            cart.save().then(rows=>res.json(rows)).catch(err=>res.status(500).json({msg: err}));
        }).catch(err=> res.status(500).json({msg: err}));
    }catch(err){
        return res.status(400).json({msg: err});
    }
});

route.delete('/:id', (req, res) => {
    try {
        Cart.findByPk(req.params.id)
            .then(cart => {
                cart.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

route.delete('/all', (req, res) => {
    try {
        Cart.findAll()
            .then(res=>res.json())
            .then(data=> {
                data.destroy();
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

module.exports = route;
