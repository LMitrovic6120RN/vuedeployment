const Joi = require('@hapi/joi');

const reviewsSchema = Joi.object({
    rating: Joi.number().min(1).max(10).required(),
    text: Joi.string().min(1).max(2048)
});

module.exports = {
    reviewsSchema: reviewsSchema
}