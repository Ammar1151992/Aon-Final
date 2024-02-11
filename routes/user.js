const express = require("express");
const route = express.Router()
const auth = require("../middleware")

const {register, login, userView} = require("../model/user")

route.post("/register", register)
route.post("/login", login)
route.get("/view", auth, userView)



module.exports = route;