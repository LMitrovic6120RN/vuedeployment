const {sequelize, Users} = require('../models');
const {registerSchema, updateSchema} = require('../helpers/validation/usersSchema');
const express = require('express');
const bcrypt = require('bcrypt');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    Users.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.get('/:id', (req, res) => {
    Users.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
});

route.post('/', async (req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(403).json({msg: "No priveleges."})
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    console.log(token);
    if (payload.admin === false)
        return res.status(403).json({msg: "Not admin!"});
    try{
    const forValidation = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }
    await registerSchema.validateAsync(forValidation, {abortEarly: false});
    const bcryptedPassword = await bcrypt.hash(req.body.password, 10);

    Users.create({username: req.body.username, password: bcryptedPassword, email: req.body.email, admin: req.body.admin, moderator: req.body.moderator})
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
    } catch(err){
        //console.log(err);
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
    if (payload.admin === false)
        res.status(403).json({msg: "Not admin!"});
    else {
        Users.findByPk(req.params.id)
            .then(user => {
                user.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            })
            .catch(err => res.status(500).json({msg: err}));
    }
});

route.put('/:id', async(req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(403).json({msg: "No priveleges."})
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    console.log(token);
    if (payload.admin === false)
        return res.status(403).json({msg: "Not admin!"});
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
                    .catch(err => res.status(500).json({msg: err}));
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