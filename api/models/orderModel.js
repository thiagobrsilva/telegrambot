var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var orderModel = new Schema({
  start_dt: { type: Date, default: Date.now },
  finish_dt: Date,
  link: String,
  type: String,
  status: Number
});

// table name Order
module.exports = mongoose.model("Order", orderModel);
