const Joi = require('joi');

schema = Joi.object({
  
        title: Joi.string()
            .required(),

        description: Joi.string()
            .required(),
                
    price : Joi.number().required(),
    location : Joi.string().required(),
      image: Joi.object({
        url: Joi.string().allow("", null)
    }),
   
    country : Joi.string().required(),

})

module.exports = schema;