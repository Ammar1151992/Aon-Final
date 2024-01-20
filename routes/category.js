const express = require("express");
const route = express.Router()
const {categoryView, addCategory, editCategory, deleteCategory} = require("../model/category")

route.get("/view", categoryView)
route.post("/add", addCategory)
route.put("/edit/:id", editCategory)
route.delete("/delete/:id", deleteCategory)


module.exports = route;