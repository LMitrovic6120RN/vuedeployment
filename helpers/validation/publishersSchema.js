const Joi = require('@hapi/joi');

const publishersSchema = Joi.object({
    name: Joi.string().min(1).max(64).required()
});

module.exports = {
    publishersSchema: publishersSchema
}