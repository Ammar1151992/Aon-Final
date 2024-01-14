const { PrismaClient } = require("@prisma/client");
const { uploadFile } = require('@uploadcare/upload-client'); 

const prisma = new PrismaClient();

const productView = async (req, res) => {
    const allProduct = await prisma.product.findMany()
    console.log(allProduct);
}

const addProduct = async (req, res) => {
    const { title,
            image,  
            description, 
            price,  
            color,  
            product_size } = await req.body;
    console.log(title,
      image,  
      description, 
      price,  
      color,  
      product_size);
  // try {
  //   let product = await prisma.category.create({
  //     data: body,
  //   });
  //   return res.send({
  //     success: true,
  //     product,
  //   });
  // } catch (error) {
  //   return res.send({
  //     success: false,
  //     error,
  //   });
  // }
}

// const image = await uploadFile(req.files.file.data,
//   {
//     publicKey: process.env.UPLOAD_KEY,
//     store: 'auto',
//     metadata: {
//       subsystem: 'uploader',
//       pet: 'cat'
//     }
//   }

module.exports = {
    productView,
    addProduct
}
