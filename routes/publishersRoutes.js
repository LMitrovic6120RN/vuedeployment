const {sequelize, Publishers} = require('../models');
const {publishersSchema} = require('../helpers/validation/publishersSchema');
const express = require('express');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Publishers.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Publishers.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/find/:byname', (req, res) => {
    try{
        Publishers.findOne({
            where: {name: req.params.byname}
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
    if (payload.admin === false){ //mozda dodati da moderator stavlja a ne admin?
        return res.status(403).json({msg: "Only admins can post new publishers."});
    }
    try{
        const forValidation = {
            name: req.body.name
        }
        await publishersSchema.validateAsync(forValidation, {abortEarly: false});
        Publishers.create({name: req.body.name})
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
        return res.status(403).json({msg: "Only admins can post new publishers."});
    }
    try{
        const forValidation = {
            name: req.body.name
        }
        await publishersSchema.validateAsync(forValidation, {abortEarly: false});
        Publishers.findByPk(req.params.id)
            .then(publisher => {
                publisher.name = req.body.name
                publisher.save()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
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
        return res.status(403).json({msg: "Only admins can post new publishers."});
    }
    try {
        Publishers.findByPk(req.params.id)
            .then(publisher => {
                publisher.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json(err));
    } catch(err){
        return res.status(400).json({msg: err});
    }
});

module.exports = route;
