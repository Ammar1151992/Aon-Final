const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const basketView = async (req, res) => {
  const userId = +req.user.id;
  try {
    const basket = await prisma.basket.findMany({
      where: {
        userId: userId,
      },
    });
    if (basket.length > 0) {
      return res.send({
        success: true,
        basket,
      });
    } else {
      return res.status(404).send({
        success: false,
        msg: "No data",
      });
    }
  } catch (error) {
    return res.send({
      success: false,
      error,
    });
  }
};

const addBasket = async (req, res) => {
  const { productId } = req.body;
  const userId = +req.user.id;

  try {
    const getProduct = await prisma.product.findUnique({
      where: {id: productId}
    });  
    if (getProduct) {
      const addBasket = await prisma.basket.create({
        data: {
          product: getProduct,
          user: {
            connect: { id: parseInt(userId) },
          },
        },
      });
      return res.send({
        success: true,
        addBasket,
      });
    } else {
      return res.status(404).send({
        success: false,
        msg: "Try Again",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      error
    })
  }

};

const deleteBasket = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = +req.user.id;
  try {
    const deleteBasket = await prisma.basket.delete({
      where: {
        id: id,
        userId: userId
      },
    });
    
    if (!deleteBasket) {
      return res.status(404).send({
        success: false,
        msg: "Basket not found or you don't have permission to delete it.",
      });
    } else {
      res.send({
        success: true,
        deleteBasket,
        msg: "The order has been deleted!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: "An error occurred while deleting the basket.",
      error: error.message
    });
  }
};



const basketAdmin = async (req, res) => {
  const userId = +req.user.id;
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let cart = await prisma.basket.findMany();
      if (cart.length > 0) {
        return res.send({
          success: true,
          cart,
        });
      } else {
        return res.status(404).send({
          success: false,
          msg: "No data",
        });
      }
    } else {
      return res.status(401).send({
        success: false,
        msg: "You do not have access",
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
