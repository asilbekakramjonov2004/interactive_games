const Joi = require("joi");

exports.ownerValidation = (body) => {
    const schemaOwner = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        company_name: Joi.string().required(),
        phone_number: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
        email: Joi.string().email().required(),
        address: Joi.string().required(),
        password: Joi.string().min(6).required(),
        refresh_token: Joi.string(),
        registration_date: Joi.date(),
        is_creator: Joi.boolean().default(true),
        is_active: Joi.boolean().default(true),
        activation_link: Joi.string(),
    });

    return schemaOwner.validate(body, { abortEarly: false });
};
