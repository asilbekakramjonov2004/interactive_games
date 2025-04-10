const Joi = require("joi");

exports.categoriesValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
    });

    return schema.validate(body, { abortEarly: false });
};