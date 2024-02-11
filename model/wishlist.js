const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const wishlistView = async (req, res) => {
  const userId = +req.user.id;
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: userId
      }
    })
    if(wishlist.length > 0){
      return res.send({
        success: true,
        wishlist
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
  const { productId } = req.body;
  const userId = +req.user.id;

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


const wishListAdmin = async (req, res) => {
  const userId = +req.user.id;
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let wishlist = await prisma.wishlist.findMany();
      if(wishlist.length > 0){
        return res.send({
          success: true,
          wishlist,
        });
      }else{
        return res
        .status(401)
        .send({
          success: false,
          msg: "No data",
        });
      }
     
    } else {
      return res.send({
        success: false,
        msg: "You do not have access permission",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
    });
  }
};


module.exports = { addWishlist, deleteWishlist, wishlistView, wishListAdmin };
