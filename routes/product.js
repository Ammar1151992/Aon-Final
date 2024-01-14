const express = require("express");
const route = express.Router()
const {productView, addProduct} = require("../model/product")

route.get("/view", productView)
route.post("/add", addProduct)


module.exports = route;