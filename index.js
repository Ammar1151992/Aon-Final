const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const product = require("./routes/product");
const category = require("./routes/category");
const tag = require("./routes/tag")
const port = 3000;

app.use(express.json())
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 124}
}))

app.use("/product", product);
app.use("/category", category);
app.use("/tag", tag);



app.listen(port, () => {
    console.log("Localhost:3000");
})