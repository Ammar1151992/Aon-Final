const { PrismaClient } = require("@prisma/client");
const { uploadFile } = require("@uploadcare/upload-client");

const prisma = new PrismaClient();

const depView = async (req, res) => {
  const search = req.query.search;

  try {
    if (search) {
      const filterSearch = await prisma.dep.findMany({
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
      const department = await prisma.dep.findMany({
        select: {
          id: true,
          name: true,
          image: true
        }
      });
      if (department) {
        res.send({
          success: true,
          department,
        });
      } else{
        return res
        .status(404)
        .send({
          success: false,
          msg: "No data found",
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

const addDep= async (req, res) => {
  const body = req.body;
  const userId = +req.user.id;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let department = await prisma.dep.create({
        data: body,
      });
      return res.send({
        success: true,
        department,
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
    return res.send({
      success: false,
      error,
    });
  }
};

const editDep = async (req, res) => {
  const id = req.params.id;
  const userId = +req.user.id;
  const { name, image } = req.body;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let department = await prisma.dep.update({
        where: { id: +id },
        data: { name, image },
      });
      if (!department) {
        return res.status(404).send({
          success: false,
          error: "data not found",
        });
      }
      res.send({
        success: true,
        department,
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

const deleteDep = async (req, res) => {
  const id = req.params.id;
  const userId = +req.user.id;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let department = await prisma.dep.delete({
        where: { id: +id },
      });
      if (!department) {
        return res.status(404).send({
          success: false,
          error: "Data not found",
        });
      }
      res.send({
        success: true,
        msg: "Data has been deleted",
        department,
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
  depView,
  addDep,
  editDep,
  deleteDep,
};
