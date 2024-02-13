const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const orderView = async (req, res) => {
  const userId = +req.user.id;
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: parseInt(userId)
      }
    })
    if(order.length > 0){
      return res.send({
        success: true,
        order
      })
    }else{
      return res
      .status(404)
      .send({
        success: false,
        msg: "No data",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error
    })
  }
  
}


const addOrder = async (req, res) => {
  const { purchase_type, productId } = req.body;
  const userId = +req.user.id;


  const getAllProduct = await prisma.product.findMany();
  const getProduct = getAllProduct.find((el) => el.id == productId);

  if (getProduct) {
    const addUserOrder = await prisma.order.create({
      data: {
        purchase_type,
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
  } else{
    return res
    .status(404)
    .send({
      success: false,
      msg: "Try again",
    });
  }
};

const deleteOrder = async (req, res) => {
    let id = parseInt(req.params.id);

    const deleteOrder = await prisma.order.delete({
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

const orderAdmin = async (req, res) => {
  const userId = +req.user.id;
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let order = await prisma.order.findMany();
      if(order.length > 0) {
        return res.send({
          success: true,
          order,
        });
      }else{
        return res
        .status(404)
        .send({
          success: false,
          msg: "No data",
        });
      }
    } else{
      return res
      .status(401)
      .send({
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
module.exports = { addOrder, deleteOrder, orderView, orderAdmin};
