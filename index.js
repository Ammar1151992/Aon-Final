const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const auth = require("./middleware")
const product = require("./routes/product");
const category = require("./routes/category");
const tag = require("./routes/tag")
const user =  require("./routes/user")
const order = require("./routes/order")
const wish = require("./routes/wishlist")
const cors = require('cors');


const port = 3000;

app.use(cors());
app.use(express.json())
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024}
}))

app.use("/product", product);
app.use("/category", category);
app.use("/tag", auth, tag);
app.use("/user", user);
app.use("/order", auth, order);
app.use("/wishlist", auth, wish);



app.listen(port, () => {
    console.log("Localhost:3000");
})