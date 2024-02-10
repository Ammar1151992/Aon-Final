const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const tagView = async (req, res) => {
  try {
      let tag = await prisma.tag.findMany();
      if(tag.length > 0){
         res.send({
          success: true,
          tag,
        });
      } else{
          res.send({
          success: false,
          msg: "There is no data to be displayed",
        });
      } 
  } catch (error) {
      res.send({
      success: false,
      error,
    });
  }
}

const addTag = async (req, res) => {
  const userId = +req.user.id;
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      const { name } = req.body;
      let tag = await prisma.tag.create({
        data: { name },
      });
      return res.send({
        success: true,
        tag,
      });
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

const editTag = async (req, res) => {
  const tagId = req.query.tagId;
  const userId = +req.user.id;
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      const { name } = req.body;
      let tag = await prisma.tag.update({
        where: {id: tagId},
        data: { name },
      });
      return res.send({
        success: true,
        tag,
      });
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

const deleteTag = async (req, res) => {
  const id = req.params.id;
  const userId = +req.user.id;

  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      const deletBridge = await prisma.bridge.deleteMany({
        where: { tagIds: id },
      });
      if(!deletBridge) {
        return res.send({
          success:false,
          msg: "This Tag is not found"
        })
      }
      let tag = await prisma.tag.delete({
        where: {id: id},
      });
      if(tag) {
        return res.send({
          success: true,
          tag,
        });
      }else {
        return res.send({
          success: false,
          msg:"This Tag is not found"
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
}

module.exports = {tagView, addTag, editTag, deleteTag};
