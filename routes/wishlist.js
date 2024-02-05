const express = require("express");
const route = express.Router()
const { addWishlist, deleteWishlist, wishlistView} = require("../model/wishlist")

route.get("/view", wishlistView);
route.post("/add", addWishlist);
route.delete("/delete/:id", deleteWishlist);



module.exports = route;