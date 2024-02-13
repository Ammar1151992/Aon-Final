const express = require("express");
const route = express.Router()
const { basketView, addBasket, deleteBasket, basketAdmin } = require("../model/basket")

route.get("/userView", basketView);
route.get("/view", basketAdmin);
route.post("/add", addBasket);
route.delete("/delete/:id", deleteBasket);



module.exports = route;