const { PrismaClient } = require("@prisma/client");
const { uploadFile } = require("@uploadcare/upload-client");
const dayjs = require("dayjs");

const prisma = new PrismaClient();

const productView = async (req, res) => {
  const search = +req.query.search;
  const category = +req.query.categoryId;
  const tagId = +req.query.tagId;
  const { limit = 10, skip = 1 } = req.query;
 
  let pageSize = parseInt(limit)
  let pageNumber = parseInt(skip)

  if (search) {
    const filterSearch = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return res.send({
      success: true,
      filterSearch,
    });
  } else if (category) {
    const categoryProducts = await prisma.product.findMany({
      where: {
        categoryId: category,
      },
      include: {
        category: true,
        discount: true,
      },
    });
    return res.send({
      success: true,
      categoryProducts,
    });
  } else if (tagId) {
    const tagProducts = await prisma.tag.findMany({
      where: {
        id: tagId,
      },
      include: {
        bridges: {
          include: {
            product: {
              include: {
                category: true,
                discount: true,
              },
            },
          },
        },
      },
    });

    if (tagProducts.length === 0) {
      return res.status(404).send({
        success: false,
        msg: "No data",
      });
    }
    
    const productTag = tagProducts.map((tag) => {
      if (tag.bridges && tag.bridges.length > 0) {
        return tag.bridges.map((bridge) => bridge.product);
      } else {
        return [];
      }
    });
      return res.send({
      success: true,
      productTag,
    });
  } else {
    const product = await prisma.product.findMany({
      take: pageSize,
      skip: pageSize * (pageNumber-1),
      select: {
        id: true,
        title: true,
        image: true,
        description: true,
        price: true,
        color: true,
        product_size: true,
        is_active: true,
        createAt: true,
      }
    });
    return res.send({
      success: true,
      product,
    });
  }
};

const addProduct = async (req, res) => {
  const userId = +req.user.id;
  
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if(checkAdmin.isAdmin === true) {
      const {
        title,
        description,
        prices,
        color,
        product_size,
        is_active,
        categoryIds,
        tagIds
      } = req.body;
    
      const price = parseFloat(prices);
      const categoryId = parseInt(categoryIds);
    
      const uploadFiles = await uploadFile(req.files.file.data, {
        publicKey: process.env.UPLOAD_KEY,
        store: "auto",
        metadata: {
          subsystem: "uploader",
          pet: "cat",
        },
      });
      const image = uploadFiles.cdnUrl;
    
      let product = await prisma.product.create({
        data: {
          title,
          image,
          description,
          price,
          color,
          product_size,
          is_active: is_active !== undefined ? is_active : true,
          category: {
            connect: { id: categoryId },
          },
        },
      });
  
      let bridges = await prisma.bridge.createMany({
        data: tagIds.map(tagId => ({
          productId: product.id,
          tagIds: parseInt(tagId),
        })),
      });
      res.send({
        success: true,
        product,
        bridges
      });
    }else{
      return res
      .status(401)
      .send({
        success: false,
        msg: "You do not have access",
      });
    }
    
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
}

const editProduct = async (req, res) => {
  const userId = +req.user.id;
  const id = +req.params.id;
try {
  const checkAdmin = await prisma.user.findUnique({
    where: { id: userId },
  });
  if(checkAdmin.isAdmin === true) {
    const {
      title,
      description,
      prices,
      color,
      product_size,
      is_active,
      categoryIds,
      tagIds
    } = req.body;
  
    const price = parseFloat(prices);
    const categoryId = parseInt(categoryIds);
  
    const uploadFiles = await uploadFile(req.files.file.data, {
      publicKey: process.env.UPLOAD_KEY,
      store: "auto",
      metadata: {
        subsystem: "uploader",
        pet: "cat",
      },
    });
    const image = uploadFiles.cdnUrl;
  
    let product = await prisma.product.update({
      where: {id: id},
      data: {
        title,
        image,
        description,
        price,
        color,
        product_size,
        is_active: is_active !== undefined ? is_active : true,
        category: {
          connect: { id: categoryId },
        },
      },
    });
    if(!product){
      return res
      .status(404)
      .send({
        success: false,
        msg: "No data",
      });
    }
    let bridges = await prisma.bridge.createMany({
      data: tagIds.map(tagId => ({
        productId: product.id,
        tagIds: parseInt(tagId),
      })),
    });
    res.send({
      success: true,
      product,
      bridges
    });
  }else{
    return res
    .status(401)
    .send({
      success: false,
      msg: "You do not have access",
    });
  }
} catch (error) {
  return res.send({
    success: false,
    error
  })
}
}

const deletProduct = async (req, res) => {
  const id = +req.params.id;
  const userId = +req.user.id;
try {
  const checkAdmin = await prisma.user.findUnique({
    where: { id: userId },
  });
  if(checkAdmin.isAdmin === true){
    const deletBridge = await prisma.bridge.deleteMany({
      where: { productId: id },
    });

    if(!deletBridge){
      return res
      .status(404)
      .send({
        success: false,
        msg: "No data",
      });
    }
    const deleted = await prisma.product.delete({
      where: {id:id}
    })
    if(deleted){
      return res.send({
        success: true,
        deleted,
        msg: "Product has been deleted"
      })
    }else{
      return res
      .status(404)
      .send({
        success: false,
        msg: "No data",
      });
    }
  }else{
    return res
    .status(401)
    .send({
      success: false,
      msg: "You do not have access",
    });
  }
} catch (error) {
  console.log(error);
  return res.send({
    success: false,
    error
  })
}
}

module.exports = {
  productView,
  addProduct,
  editProduct,
  deletProduct
};
