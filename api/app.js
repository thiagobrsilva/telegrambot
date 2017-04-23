// imports
var express = require("express");
var mongoose = require("mongoose");
var parser = require("body-parser");

downloadPath = process.env.PWD+'/temp';

var app = express();

// Default port 3000
var port = 3000;

// Connecting to database
var db = mongoose.connect("mongodb://localhost/conversor");
mongoose.Promise = Promise;

// Model based on [https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json] MongoDB sample db
//var Restaurant = require("./models/restaurantModel");

var Order = require("./models/orderModel");

app.use(parser.urlencoded({extended:true}));
app.use(parser.json());

// Route /api/Restaurants
mainRoute = require("./routes/conversorRoutes")(Order);
app.use("/api/Conversor", mainRoute);

app.get("/", function(req, res){
  res.send("Conversor API");
});

// Listening
app.listen(port, function(){
  console.log("running");
});
