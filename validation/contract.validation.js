const Joi = require("joi");

exports.contractValidation = (body) => {
    const schema = Joi.object({
        client_id: Joi.number().integer().required(),
        product_id: Joi.number().integer().required(),
        start_date: Joi.date().required(),
        end_date: Joi.date().required(),
        status_id: Joi.number().integer().required(),
        created_at: Joi.date().required(),
        tarif_id: Joi.number().integer().required(),
        total_amount: Joi.number().integer().required()
    });

    return schema.validate(body, { abortEarly: false });
};
