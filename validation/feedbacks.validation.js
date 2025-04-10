const Joi = require("joi");

exports.feedbackValidation = (body) => {
    const schema = Joi.object({
        contract_id: Joi.number().integer().required(),
        client_id: Joi.number().integer().required(),
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().min(3).required(),
    });

    return schema.validate(body, { abortEarly: false });
};
