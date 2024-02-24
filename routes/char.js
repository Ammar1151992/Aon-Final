const express = require("express");
const route = express.Router();
const auth = require("../middleware");

const { charView, addChar, editChar, deleteChar } = require("../model/char");

route.get("/view", charView);
route.post("/add", auth, addChar);
route.put("/edit/:id", auth, editChar);
route.delete("/delete/:id", auth, deleteChar);

module.exports = route;
