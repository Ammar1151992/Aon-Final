const express = require("express");
const route = express.Router()
const { addWishlist, deleteWishlist, wishlistView,wishListAdmin} = require("../model/wishlist")

route.get("/userView", wishlistView);
route.get("/view", wishListAdmin);
route.post("/add", addWishlist);
route.delete("/delete/:id", deleteWishlist);



module.exports = route;