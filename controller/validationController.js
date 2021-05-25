const Joi = require('joi');
 
function JoiValidateUser(obj) {
    
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().required().min(6).max(80).alphanum().trim(),
        adress: {
            street: Joi.string().required(),
            zip: Joi.string().required(),
            city: Joi.string().required()
        }
    })
    return schema.validate(obj);
}

module.exports.JoiValidateUser = JoiValidateUser;



function JoiValidateProduct(obj) {
    
    const schema = Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required(),
        shortDesc: Joi.string().required(),
        longDesc: Joi.string().required(),
        imgFile: Joi.string().required().regex(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).trim()
    })
    return schema.validate(obj);
}

module.exports.JoiValidateProduct = JoiValidateProduct;