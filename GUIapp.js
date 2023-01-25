const express = require('express');
const { sequelize } = require('./models');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'static')));

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const allCookies = req.headers.cookie.split('; ');
    const parsedCks = {};

    allCookies.forEach( someCookie => {
        const parsedCk = someCookie.split('=');
        parsedCks[parsedCk[0]] = parsedCk[1];
    });
    return parsedCks;
};

function tokenAuth(req, res, next) {
    const cookies = getCookies(req);
    const tokenFromCookies = cookies['token'];

    if (tokenFromCookies == null) return res.redirect(301, '/login');

    jwt.verify(tokenFromCookies, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.redirect(301, '/register');
        req.user = user;

        next();
    });
};

app.get('/register', (req, res) => {
    res.sendFile('register.html', {root: './static/html'});
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', {root: './static/html'});
});

app.get('/', tokenAuth, (req, res) => {
    res.sendFile('homepage.html', {root: './static/html'});
});

app.get('/admin', (req, res) => {
    res.sendFile('homepage.html', {root: './static/html'});
});

app.get('/admin/users', (req, res) => {
    res.sendFile('users.html', {root: './static/html'});
});

app.get('/admin/users/:id', (req, res) => {
    res.sendFile('edit_user.html', {root: './static/html'});
});

app.get('/admin/games', (req, res) => {
    res.sendFile('games.html', {root: './static/html'});
});

app.get('/admin/games/:id', (req, res) => {
    res.sendFile('game_info.html', {root: './static/html'});
});

app.get('/admin/cart', (req, res) => {
    res.sendFile('cart.html', {root: './static/html'});
});

app.get('/admin/wishlist', (req, res) => {
    res.sendFile('wishlist.html', {root: './static/html'});
});

app.get('/admin/reviews/:id', (req, res) => {
    res.sendFile('post_review.html', {root: './static/html'});
});

app.get('/admin/reviews', (req, res) => {
    res.sendFile('reviews.html', {root: './static/html'});
});

app.get('/admin/receipt/:id', (req, res) => {
    res.sendFile('receipt.html', {root: './static/html'});
});

app.get('/admin/categories', (req, res) => {
    res.sendFile('categories.html', {root: './static/html'});
});

app.get('/admin/publishers', (req, res) => {
    res.sendFile('publishers.html', {root: './static/html'});
});


app.listen({port: 8000}, async() => {
    await sequelize.authenticate();
});