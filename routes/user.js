const express = require("express");
const route = express.Router()
const auth = require("../middleware")

const {register, login, userView, adminView, userUpdate} = require("../model/user")

route.post("/register", register)
route.post("/login", login)
route.get("/view", auth, adminView)
route.get("/userView", auth, userView)
route.put("/edit", auth, userUpdate)



module.exports = route;