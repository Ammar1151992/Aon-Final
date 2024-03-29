const { PrismaClient } = require("@prisma/client");
const { uploadFile } = require("@uploadcare/upload-client");

const prisma = new PrismaClient();

const categoryView = async (req, res) => {
  const search = req.query.search;
  const { limit = 10, skip = 1 } = req.query;
  let pageSize = parseInt(limit);
  let pageNumber = parseInt(skip);

  try {
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
      const category = await prisma.category.findMany({
        take: pageSize,
        skip: pageSize * (pageNumber - 1),
        select: {
          id: true,
          name: true,
          image: true
        }
      });
      if (category) {
        res.send({
          success: true,
          category,
        });
      } else{
        return res
        .status(404)
        .send({
          success: false,
          msg: "No data",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      error
    })
  }
  
};

const addCategory = async (req, res) => {
  const body = req.body;
  const userId = +req.user.id;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let category = await prisma.category.create({
        data: body,
      });
      return res.send({
        success: true,
        category,
      });
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
    return res.send({
      success: false,
      error,
    });
  }
};

const editCategory = async (req, res) => {
  const id = req.params.id;
  const userId = +req.user.id;
  const { name, image_url } = req.body;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
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
    } else{
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
};

const deleteCategory = async (req, res) => {
  const id = +req.params.id;
  const userId = +req.user.id;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
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
    } else{
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
