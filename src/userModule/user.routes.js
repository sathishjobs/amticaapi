let express = require("express");
let validate = require("express-validation");

let userController = require("./user.controller");
let userValidation = require("./user.validation");
let {authJwt} = require("../service/authService");
const routes = new express.Router();

//sign in
routes.post(
  "/signin",
  validate(userValidation.signIn),
  userController.signIn
);

//sign up
routes.post(
  "/signup/",
  validate(userValidation.signUp),
  userController.signUp
);

//check is user already exist
routes.post(
  "/isUserExist/",
  validate(userValidation.isUserExist),
  userController.isUserExist
);

//home route 
routes.get("/home/",authJwt,userController.home);

module.exports.routes = routes;
