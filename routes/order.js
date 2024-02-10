const express = require("express");
const route = express.Router()
const {addOrder, deleteOrder, orderView, orderAdmin} = require("../model/order")

route.get("/userView", orderView);
route.get("/view", orderAdmin);
route.post("/add", addOrder);
route.delete("/delete/:id", deleteOrder);



module.exports = route;