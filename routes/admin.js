const {sequelize} = require('../models');
const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ============| Routes |===========
const usersRoutes = require('./usersRoutes');
const publishersRoutes = require('./publishersRoutes');
const categoriesRoutes = require('./categoriesRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const reviewsRoutes = require('./reviewsRoutes');
const cartsRoutes = require('./cartsRoutes');
const itemRoutes = require('./itemsRoutes');
const receiptsRoutes = require('./receiptsRoutes');
const paymentsRoutes = require('./paymentsRoutes');
const gamesRoutes = require('./gamesRoutes');
// =================================

function authToken(req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decTok = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decTok){
            console.log("Korisnik ulogovan, authToken ide dalje.");
            next();
        } else{
            console.log("ULOGUJ SE!");
            return res.status(400).json({msg: "Korisnik nije ulogovan."});
        }
    }catch(err){
        console.log("Morate biti ulogovani.");
        return res.status(400).json({msg: "Korisnik nije ulogovan!"});
    }
}

route.use(express.json());
route.use(express.urlencoded({extended: true}));
//route.use(authToken);
route.use('/users', usersRoutes);
route.use('/publishers', publishersRoutes);
route.use('/categories', categoriesRoutes);
route.use('/wishlist', wishlistRoutes);
route.use('/reviews', reviewsRoutes);
route.use('/cart', cartsRoutes);
route.use('/item', itemRoutes);
route.use('/receipts', receiptsRoutes);
route.use('/payments', paymentsRoutes);
route.use('/games', gamesRoutes);

module.exports = route;