const express = require("express");
const auth = require("../middleware")
const route = express.Router()
const {
    productView, 
    addProduct, 
    editProduct, 
    deletProduct} = require("../model/product")

route.get("/view", productView)
route.post("/add", auth, addProduct)
route.put("/edit/:id", auth, editProduct)
route.delete("/delete/:id", auth, deletProduct)


module.exports = route;