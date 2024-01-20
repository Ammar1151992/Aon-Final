const express = require("express");
const route = express.Router()

const addTag = require("../model/tag");

route.post("/addTag", addTag);

module.exports = route;