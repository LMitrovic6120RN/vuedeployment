const {sequelize, Payments} = require('../models');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Payments.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Payments.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.post('/', async (req, res) => {
    try{
        Payments.create(req.body)
            .then(rows => res.json(rows))
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

route.put('/:id', async (req, res) => {
    try{
        Payments.findByPk(req.params.id)
            .then(payment => {
                payment.payments_number= req.body.payments_number,
                payment.total_payments= req.body.total_payments,
                payment.usersId= req.body.usersId
                payment.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

route.delete('/:id', (req, res) => {
    try {
        Payments.findByPk(req.params.id)
            .then(payment => {
                payment.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

module.exports = route;
