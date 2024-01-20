const { PrismaClient } = require("@prisma/client");
const { add } = require("date-fns");

const prisma = new PrismaClient();

const addTag = async (req, res) => {
  const { name } = req.body;
  try {
    let tag = await prisma.tag.create({
      data: {name},
    });
    res.send({
      success: true,
      tag,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
    });
  }
};

module.exports = addTag;
