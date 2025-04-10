const Joi = require("joi");

exports.paymentValidation = (body) => {
    const schema = Joi.object({
        contract_id: Joi.number().integer().required(),
        amount: Joi.number().positive().required(),
        payment_date: Joi.date().required(),
        payment_method: Joi.string().min(3).required(),
        created_at: Joi.string().required(),
        status: Joi.string().required()
    });

    return schema.validate(body, { abortEarly: false });
};
