let express = require("express");
let validate = require("express-validation");

let bookingController = require("./booking.controller");
let bookingValidation = require("./booking.validation");
const routes = new express.Router();

//create screen
routes.post(
  "/",
  validate(bookingValidation.bookingCreation),
  bookingController.createMovieScreen
);

//book ticker
routes.post(
  "/:screenName/reserve/",
  validate(bookingValidation.reserveValidation),
  bookingController.reserveScreen
);

//get unreserved seats by screen
routes.get("/:screenName/seats/", bookingController.getUnservedSeatsByScreen);

module.exports.routes = routes;
