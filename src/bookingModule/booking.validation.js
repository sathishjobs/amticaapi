let Joi = require("joi");

module.exports = {
  bookingCreation: {
    body: {
      name: Joi.string().required(),
    
    }
  },
  reserveValidation : {
      body : {
          seats : Joi.object().required()
      }
  },
};
