const express = require("express");
const route = express.Router()
const auth = require("../middleware")

const {categoryView, addCategory, editCategory, deleteCategory} = require("../model/category")

route.get("/view", categoryView)
route.post("/add", auth, addCategory)
route.put("/edit/:id", auth, editCategory)
route.delete("/delete/:id", auth, deleteCategory)


module.exports = route;