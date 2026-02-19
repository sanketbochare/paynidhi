import joi from "joi"

const sellerValidationSchema = joi.object({
    email: joi
    .string()
    .trim()
    .email()
    .lowercase()
    .required(),

    panNumber: joi
    .string()
    .trim()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .required(),

    gstNumber: joi
    .string()
    .trim()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .required()

    
})
