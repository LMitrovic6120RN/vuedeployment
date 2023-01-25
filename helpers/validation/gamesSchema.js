const Joi = require('@hapi/joi');

const gamesSchema = Joi.object({
    title: Joi.string().min(2).max(64).required(),
    year: Joi.number().required(),
    price: Joi.number().required()
});

module.exports = {
    gamesSchema: gamesSchema
}