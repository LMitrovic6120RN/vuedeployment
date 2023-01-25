const path = require("path");
const express = require("express");
const cors = require('cors');
const { sequelize , Users, Reviews, Cart}  = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const history = require('connect-history-api-fallback');

const app = express();
//app.use(express.static(path.join(__dirname, '/static')))

//namestanje server-a

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://lmitrovicvue.onrender.com',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    allowEIO3: true
});

var corsOptions = {
    origin: 'https://lmitrovicvue.onrender.com',
    optionsSuccessStatus: 200
}
app.use(express.json());
app.use(cors(corsOptions));

const adminRoutes = require('./routes/admin.js');
app.use('/admin', adminRoutes);
/*
sequelize.sync({force: true}).then(result => {
    app.listen({port:8090}, async () => {
        await sequelize.authenticate();
        console.log("app.js started");
    });
}).catch(err => console.log(err));
*/

app.post('/auth/register', async (req, res) => {
    console.log("Usao u register, auth");
    const usr = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        admin: req.body.admin,
        moderator: req.body.moderator
    };
    console.log(JSON.stringify(usr));
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

app.post('/auth/login', async (req, res) => {
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
                Cart.create({user_cart: user.id, to_pay: 0.0}).catch(err=>res.status(500).json(err));
            } else {
                res.status(400).json({msg: "Incorrect username or passowrd. Try again."});
            }
        })
        .catch(err => res.json({msg: "Neispravni podaci.", err: err}));
});

function authSocket(msg, next) {
    if (msg[1].token == null) {
        next(new Error("Not authenticated"));
    } else {
        jwt.verify(msg[1].token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                next(new Error(err));
            } else {
                msg[1].user = user;
                next();
            }
        });
    }
}

io.on('connection', socket => {
    socket.use(authSocket);

    socket.on('review', msg => {
        Reviews.create({rating: msg.rating, text: msg.text, game_review: msg.game_review, user_review: msg.user_review})
            .then(rows => {
                Reviews.findOne({where: {id: rows.id}})
                    .then( msg => io.emit('review', JSON.stringify(msg)))
            }).catch(err=>{
                console.log(err);
                return;
            });
    });
    socket.on('error', err=>socket.emit('error', err.message));
});

const staticMdl = express.static(path.join(__dirname, 'dist'));
app.use(staticMdl);
app.use(history({ index: '/index.html'}));
app.use(staticMdl);

server.listen({port: 8000}, async() => {
    await sequelize.authenticate();
    console.log("Backend started.");
});

/*
app.listen({port:8090}, async () => {
    await sequelize.authenticate();
    console.log("app.js started");
});
*/