const { PrismaClient } = require("@prisma/client");
const { uploadFile } = require("@uploadcare/upload-client");
const dayjs = require("dayjs");

const prisma = new PrismaClient();

const productView = async (req, res) => {
  const search = +req.query.search;
  const category = +req.query.categoryId;
  const tagId = +req.query.tagId;

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
        msg: "Tag is not found",
      });
    }

    const productTag = tagProducts.bridges.map((bridge) => bridge.product);
    return res.send({
      success: true,
      productTag,
    });
  } else {
    const allProduct = await prisma.product.findMany();
    return res.send({
      success: true,
      allProduct,
    });
  }
};

const addProduct = async (req, res) => {
  const userId = +req.query.userId;
  
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
    }else {
      return res.send({
        success: false,
        msg: "You do not have access permission",
      });
    }
    
  } catch (error) {
    res.send({
      success: false,
      error,
    });
    console.log(error);
  }
}

const editProduct = async (req, res) => {
  const userId = +req.query.userId;
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
      return res.send({
        success: false,
        msg: "Not found"
      })
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
  }else {
    return res.send({
      success: false,
      msg: "You do not have access permission",
    });
  }
} catch (error) {
  return res.send({
    success: false,
    error
  })
}
}

const deletProduct = async (res, req) => {
  const id = req.params.id;
  const userId = req.query.userId;
try {
  const checkAdmin = await prisma.user.findUnique({
    where: { id: userId },
  });
  if(checkAdmin.isAdmin === true){
    const deleted = await prisma.product.delete({
      where: {id:id}
    })
    if(deleted){
      return res.send({
        success: true,
        deleted,
        msg: "Product has been deleted"
      })
    }
  }
} catch (error) {
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
