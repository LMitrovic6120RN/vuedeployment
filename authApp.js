const express = require('express');
const {sequelize, Users} = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const {registerSchema, updateSchema} = require('./helpers/validation/usersSchema');

const app = express();

var corsOptions = {
    origin: 'http://127.0.0.1:8000',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.post('/register', async (req, res) => {
    console.log("Usao u register, auth");
    const usr = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        admin: req.body.admin,
        moderator: req.body.moderator
    };

    Users.create(usr).then(rows => {
        const newUser = {
            usersId: rows.id,
            username: rows.username,
            admin: rows.admin,
            moderator: rows.moderator
        };
        const token = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET);
        console.log(token);
        res.json({token: token});
    }).catch(err => res.status(500).json({msg: err}));
});

app.post('/login', async (req, res) => {
    console.log("Usao u login, auth");
    console.log(req.body);
    Users.findOne({where: {username: req.body.username}})
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)){
                const loggedInUser = {
                    usersId: user.id,
                    username: user.username,
                    admin: user.admin,
                    moderator: user.moderator
                };
                const token = jwt.sign(loggedInUser, process.env.ACCESS_TOKEN_SECRET);
                res.json({token: token});
            } else {
                res.status(400).json({msg: "Incorrect username or passowrd. Try again."});
            }
        })
        .catch(err => res.status(500).json({msg: "Neispravni podaci."}));
});

app.listen({port: 8081}, async () => {
    await sequelize.authenticate();
});