const express = require("express");
const route = express.Router()
const auth = require("../middleware")

const {register, login, userView, AdminView} = require("../model/user")

route.post("/register", register)
route.post("/login", login)
route.get("/view", auth, AdminView)
route.get("/userView", auth, userView)



module.exports = route;