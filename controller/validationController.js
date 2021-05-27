const Joi = require('joi');

// Some examples: .string() = makes sure it's a string that's returned, even if a number is inserted a string value will be returned
//                .email() = makes sure the user has entered a email
//                .required() = makes sure the value is not empty
//                .alphanum() = makes sure the value only contains (a-z, A-Z) & (0-9) characters

// Function that validates the schema object from the users input with Joi middleware, in this case the user object
function JoiValidateUser(obj) {
    
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().required().min(6).max(80).alphanum().trim(),
        repeatPassword: Joi.any(),
        adress: {
            street: Joi.string().required(),
            zip: Joi.string().required(),
            city: Joi.string().required()
        }
    })
    // returns the schema and validates whatever obj we put in
    return schema.validate(obj);
}
// Exports the function by name of function
module.exports.JoiValidateUser = JoiValidateUser;


// Function that validates the schema object from the users input with Joi middleware, in this case the product object
function JoiValidateProduct(obj) {
    
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        shortDesc: Joi.string().required(),
        serial: Joi.any(),
        longDesc: Joi.string().required(),
        imgFile: Joi.string().required().regex(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).trim()
    })
    return schema.validate(obj);
}

module.exports.JoiValidateProduct = JoiValidateProduct;