const Joi = require("joi");

exports.clientValidation = (body) => {
    const schemaClient = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone_number: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
        email: Joi.string().email().required(),
        passport: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string(),
        refresh_token: Joi.string(),
        registration_date: Joi.date(),
        activation_link: Joi.string(),
    });

    return schemaClient.validate(body, { abortEarly: false });
};