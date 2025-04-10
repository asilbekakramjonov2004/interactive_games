const Joi = require("joi");

exports.productValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(10).required(),
        price_per_day: Joi.number().positive().required(),
        category_id: Joi.number().integer().required(),
        owner_id: Joi.number().integer().required(),
        is_active: Joi.boolean().required(),
    });

    return schema.validate(body, { abortEarly: false });
};