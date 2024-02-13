const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const basketView = async (req, res) => {
  const userId = +req.user.id;
  try {
    const basket = await prisma.basket.findMany({
      where: {
        userId: userId
      }
    })
    if(basket.length > 0){
      return res.send({
        success: true,
        basket
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


const addBasket = async (req, res) => {
  const { productId } = req.body;
  const userId = +req.user.id;

  const getAllProduct = await prisma.product.findMany();
  const getProduct = getAllProduct.find((el) => el.id == productId);

  if (getProduct) {
    const addBasket = await prisma.basket.create({
      data: {
        product: getProduct,
        user: {
          connect: { id: parseInt(userId)},
        },
      },
    });
    return res.send({
      success: true,
      addBasket,
    });
  } else {
    return res.send({
      success: false,
      msg: "Try again!",
    });
  }
};

const deleteBasket = async (req, res) => {
    let id = parseInt(req.params.id);

    const deleteBasket = await prisma.basket.delete({
      where: {
        id: id
      }
    });
    res.send({
      success: true,
      deleteBasket,
      msg: "The order has been deleted!"
    })
}


const basketAdmin = async (req, res) => {
  const userId = +req.user.id;
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let cart = await prisma.basket.findMany();
      if(cart.length > 0){
        return res.send({
          success: true,
          cart,
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


module.exports = { basketView, addBasket, deleteBasket, basketAdmin };
