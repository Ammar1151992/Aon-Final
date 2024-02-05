const express = require("express");
const route = express.Router()
const {addOrder, deleteOrder, orderView} = require("../model/order")

route.get("/view", orderView);
route.post("/add", addOrder);
route.delete("/delete/:id", deleteOrder);



module.exports = route;