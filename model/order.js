const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const orderView = async (req, res) => {
  const userId = req.query.user;
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


const addOrder = async (req, res) => {
  const { purchase_type, productId, userId } = req.body;

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
  } else {
    return res.send({
      success: false,
      msg: "Try again!",
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
module.exports = { addOrder, deleteOrder, orderView };
