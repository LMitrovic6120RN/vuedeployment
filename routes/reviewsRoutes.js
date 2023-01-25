const {sequelize, Reviews} = require('../models');
const express = require('express');
const {reviewsSchema} = require('../helpers/validation/reviewsSchema');
const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({extended: true}));

route.get('/', (req, res) => {
    try {
        Reviews.findAll()
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
    } catch (err){
        return res.status(500).json({msg: err});
    }
});

route.get('/:id', (req, res) => {
    try{
        Reviews.findByPk(req.params.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json({msg: err}));
    } catch (err){
        return res.status(500).json({msg: err});
    }
});

route.get('/game/:gameId', (req, res) => {
    try{
        Reviews.findAll({
            where: {game_review: req.params.gameId}
        }).then(rows=>res.json(rows)).catch(err=>res.status(500).json({msg: err}));
    }catch(err){
        return res.status(500).json({msg: err});
    }
});

route.post('/', async (req, res) => {
    const forValidation = {
        rating: req.body.rating,
        text: req.body.text
    }
    try{
    await reviewsSchema.validateAsync(forValidation, {abortEarly: false});
    Reviews.create(req.body)
        .then(rows => res.json(rows))
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

route.delete('/:id', (req, res) => {
    if (req.headers['authorization'] == null){
        return res.status(403).json({msg: "No priveleges."})
    }
    const token = req.headers['authorization'].split(' ')[1].split('\.')[1];
    payload = JSON.parse(atob(token));
    let usrId = payload.usersId;
    Reviews.findByPk(req.params.id)
        .then(review => {
            if (review.user_review == usrId || payload.moderator === false){
                review.destroy()
                    .then(rows => res.json(rows))
                    .catch(err => res.status(500).json({msg: err}));
            } else {
                return res.status(403).json({msg: "That is not your review!"});
            }
        })
        .catch(err => res.status(500).json({msg: err}));
});

route.put('/:id', async (req, res) => {
    try{
        const forValidation = {
            rating: req.body.rating,
            text: req.body.text
        };
        await reviewsSchema.validateAsync(forValidation, {abortEarly: false});
        Reviews.findByPk(req.params.id).then(review => {
            review.rating = req.body.rating,
            review.text = req.body.text,
            review.save().then(rows=>res.json(rows)).catch(err=>res.status(500).json({msg: err}));
        }).catch(err=>res.status(500).json({msg: err}));
    }catch(err){
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
