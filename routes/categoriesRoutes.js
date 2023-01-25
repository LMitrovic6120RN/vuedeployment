const {sequelize, Categories} = require('../models');
const {categoriesSchema} = require('../helpers/validation/categoriesSchema');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Categories.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Categories.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/find/:bytype', (req, res) => {
    try{
        Categories.findOne({
            where: {type: req.params.bytype}
        }).then(rows=>res.json(rows)).catch(err=> res.status(500).json({msg: err}));
    } catch (err) {
        return res.status(400).json({msg: err});
    }
});

route.post('/', async (req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(403).json({msg: "No priveleges."});
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    if (payload.admin === false){
        return res.status(403).json({msg: "Only admins can post new categories."});
    }
    try{
        const forValidation = {
            type: req.body.type
        }
        await categoriesSchema.validateAsync(forValidation, {abortEarly: false});
        Categories.create({type: req.body.type})
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

route.put('/:id', async (req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(403).json({msg: "No priveleges."});
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    if (payload.admin === false){
        return res.status(403).json({msg: "Only admins can post new categories."});
    }
    try{
        const forValidation = {
            type: req.body.type
        }
        await categoriesSchema.validateAsync(forValidation, {abortEarly: false});
        Categories.findByPk(req.params.id)
            .then(category => {
                category.type = req.body.type
                category.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json(err));
            })
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
        return res.status(403).json({msg: "No priveleges."});
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    if (payload.admin === false){
        return res.status(403).json({msg: "Only admins can post new categories."});
    }
    try {
        Categories.findByPk(req.params.id)
            .then(category => {
                category.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

module.exports = route;
