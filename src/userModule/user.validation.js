let Joi = require("joi");

module.exports = {
  signIn: {
    body: {
      email: Joi.string().required().email(),
      password : Joi.string().required()
    }
  },
  signUp : {
      body : {
          name : Joi.string().required(),
          email : Joi.string().required().email(),
          password : Joi.string().required()
      }
  },
  isUserExist : {
    body : {
      email : Joi.string().required().email()
    }
  }
};
