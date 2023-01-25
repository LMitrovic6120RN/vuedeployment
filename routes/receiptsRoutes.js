const {sequelize, Receipts} = require('../models');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Receipts.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Receipts.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/user/:user', (req, res) => {
    Receipts.findAll({where: {user_receipt: req.params.user}})
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
});

route.post('/', async (req, res) => {
    try{
       await Receipts.create(req.body)
            .then(rows => res.json(rows))
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

route.put('/:id', async (req, res) => {
    try{
        Receipts.findByPk(req.params.id)
            .then(receipt => {
                receipt.total = req.body.total,
                receipt.usersId = req.body.usersId,
                receipt.cartId = req.body.cartId,
                cart.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

route.delete('/:id', (req, res) => {
    try {
        Receipts.findByPk(req.params.id)
            .then(receipt => {
                receipt.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

module.exports = route;
