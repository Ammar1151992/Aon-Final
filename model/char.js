const { PrismaClient } = require("@prisma/client");
const { uploadFile } = require("@uploadcare/upload-client");

const prisma = new PrismaClient();

const charView = async (req, res) => {
  const search = req.query.search;
  const { limit = 10, skip = 1 } = req.query;
  let pageSize = parseInt(limit);
  let pageNumber = parseInt(skip);

  try {
    if (search) {
      const filterSearch = await prisma.char.findMany({
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
      const character = await prisma.char.findMany({
        take: pageSize,
        skip: pageSize * (pageNumber - 1),
        select: {
          id: true,
          name: true,
          image: true
        }
      });
      if (character) {
        res.send({
          success: true,
          character,
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

const addChar= async (req, res) => {
  const body = req.body;
  const userId = +req.user.id;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let character = await prisma.char.create({
        data: body,
      });
      return res.send({
        success: true,
        character,
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

const editChar = async (req, res) => {
  const id = req.params.id;
  const userId = +req.user.id;
  const { name, image } = req.body;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let character = await prisma.char.update({
        where: { id: +id },
        data: { name, image },
      });
      if (!character) {
        return res.status(404).send({
          success: false,
          error: "data not found",
        });
      }
      res.send({
        success: true,
        character,
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

const deleteChar = async (req, res) => {
  const id = req.params.id;
  const userId = +req.user.id;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let character = await prisma.char.delete({
        where: { id: +id },
      });
      if (!character) {
        return res.status(404).send({
          success: false,
          error: "Data not found",
        });
      }
      res.send({
        success: true,
        msg: "Data has been deleted",
        character,
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
  charView,
  addChar,
  editChar,
  deleteChar,
};
