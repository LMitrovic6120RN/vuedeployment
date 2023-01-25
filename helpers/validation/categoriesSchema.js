const Joi = require('@hapi/joi');

const categoriesSchema = Joi.object({
    type: Joi.string().min(2).max(32).required()
});

module.exports = {
    categoriesSchema: categoriesSchema
}