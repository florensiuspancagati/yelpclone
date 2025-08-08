const joi = require('joi'); // to validate the data

module.exports.placeSchema = joi.object({
        place: joi.object({
            title: joi.string().required(),
            location: joi.string().required(),
            description: joi.string().required(),
            price: joi.number().required().min(0),
        }).required() // place object is required
    }); // schema to validate the data