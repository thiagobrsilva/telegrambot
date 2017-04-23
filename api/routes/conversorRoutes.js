var express = require("express");

var routes = function(Order){
   var conversorRoute = express.Router();
   var conversorController = require("..//controllers/conversorController.js")(Order)

   conversorRoute.route("/")
      // post - insert new record
      .post(conversorController.post);

   return conversorRoute;

};

module.exports = routes;
