const Joi = require("joi");

exports.tarifValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        discount_percent: Joi.number().min(1).max(100).required(),
    });

    return schema.validate(body, { abortEarly: false });
};
