const express = require("express");
const route = express.Router();
const auth = require("../middleware");

const { depView, addDep, editDep, deleteDep } = require("../model/dep");

route.get("/view", depView);
route.post("/add", auth, addDep);
route.put("/edit/:id", auth, editDep);
route.delete("/delete/:id", auth, deleteDep);

module.exports = route;
