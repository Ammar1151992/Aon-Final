const express = require("express");
const route = express.Router()

const {tagView, addTag, editTag, deleteTag} = require("../model/tag");

route.get("/view", tagView);
route.post("/add", addTag);
route.put("/edite", editTag);
route.delete("/delete", deleteTag);

module.exports = route;