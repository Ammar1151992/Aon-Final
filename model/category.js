const { PrismaClient } = require("@prisma/client");
const { uploadFile } = require("@uploadcare/upload-client");

const prisma = new PrismaClient();

const categoryView = async (req, res) => {
  const search = req.query.search;

  if (search) {
    const filterSearch = await prisma.category.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    res.send({
      success: true,
      filterSearch,
    });
  } else {
    const allCategory = await prisma.category.findMany();
    if (allCategory) {
      res.send({
        success: true,
        allCategory,
      });
    } else {
      res.send({
        success: false,
        msg: "No data is set",
      });
    }
  }
};

const addCategory = async (req, res) => {
  const body = req.body;
  try {
    let category = await prisma.category.create({
      data: body,
    });
    return res.send({
      success: true,
      category,
    });
  } catch (error) {
    return res.send({
      success: false,
      error,
    });
  }
};

const editCategory = async (req, res) => {
  const id = req.params.id;
  const { name, image_url } = req.body;
  try {
    let category = await prisma.category.update({
      where: { id: +id },
      data: { name, image_url },
    });
    if (!category) {
      return res.status(404).send({
        success: false,
        error: "Category not found",
      });
    }
    res.send({
      success: true,
      category,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    let category = await prisma.category.delete({
      where: { id: +id },
    });
    if (!category) {
      return res.status(404).send({
        success: false,
        error: "Category not found",
      });
    }
    res.send({
      success: true,
      msg: "Category has been deleted",
      category,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
};

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
  categoryView,
  addCategory,
  editCategory,
  deleteCategory,
};
