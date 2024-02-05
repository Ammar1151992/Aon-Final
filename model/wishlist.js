const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const wishlistView = async (req, res) => {
  const userId = req.query.user;
  try {
    const getOrder = await prisma.wishlist.findMany({
      where: {
        userId: parseInt(userId)
      }
    })
    if(getOrder.length > 0){
      return res.send({
        success: true,
        getOrder
      })
    }else{
      return res.send({
        success: false,
        msg: "No order is set"
      })
    }
  } catch (error) {
    res.send({
      success: false,
      error
    })
  }
  
}


const addWishlist = async (req, res) => {
  const { productId, userId } = req.body;

  const getAllProduct = await prisma.product.findMany();
  const getProduct = getAllProduct.find((el) => el.id == productId);

  if (getProduct) {
    const addUserOrder = await prisma.wishlist.create({
      data: {
        product: getProduct,
        user: {
          connect: { id: parseInt(userId)},
        },
      },
    });
    return res.send({
      success: true,
      addUserOrder,
    });
  } else {
    return res.send({
      success: false,
      msg: "Try again!",
    });
  }
};

const deleteWishlist = async (req, res) => {
    let id = parseInt(req.params.id);

    const deleteOrder = await prisma.wishlist.delete({
      where: {
        id: id
      }
    });
    res.send({
      success: true,
      deleteOrder,
      msg: "The order has been deleted!"
    })
}
module.exports = { addWishlist, deleteWishlist, wishlistView };
