const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { name, phoneNumber, password, email, location, isAdmin } = req.body;

  const phoneNumberPattern = /^07\d{9}$/;

  if (phoneNumberPattern.test(phoneNumber)) {
    const checkUser = await prisma.user.findMany();

    if (checkUser.length > 0) {
      const checking = checkUser.find((el) => el.phoneNumber === phoneNumber);
      if (checking) {
        return res.send({
          success: false,
          msg: "This number is already exist",
        });
      } else {
        const hash = bcrypt.hashSync(password, 10);
        const registerAdded = await prisma.user.create({
          data: {
            name,
            phoneNumber,
            password: hash,
            email,
            location,
            isAdmin: isAdmin === "true",
          },
        });
        return res.send({
          success: true,
          registerAdded,
        });
      }
    } else if (checkUser.length === 0) {
      const hash = bcrypt.hashSync(password, 10);
      const registerAdded = await prisma.user.create({
        data: {
          name,
          phoneNumber,
          password: hash,
          email,
          location,
          isAdmin: isAdmin === "true",
        },
      });
      return res.send({
        success: true,
        registerAdded,
      });
    }
  } else {
    return res.send({
      success: false,
      msg: "Invalid phone number format",
    });
  }
};

const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const loginCheck = await prisma.user.findMany();

  if (loginCheck.length > 0) {
    const userLogin = loginCheck.find((el) => el.phoneNumber === phoneNumber);
    console.log(userLogin);
    if (!userLogin) {
      return res
        .status(401)
        .send({ success: false, msg: "Failed to authenticate" });
    } else {
      let comparePassword = bcrypt.compareSync(password, userLogin.password);
      if (comparePassword) {
        let token = jwt.sign(userLogin, process.env.TOKEN);
        return res.send({
          success: true,
          token,
          userLogin,
        });
      } else {
        return res.status(401).send({
          success: false,
          msg: "Your phone number or password is not correct",
        });
      }
    }
  } else {
    return res
      .status(401)
      .send({ success: false, message: "Failed to authenticate" });
  }
};

const userView = async (req, res) => {
  const userId = +req.user.id;
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true,
        location: true,
      },
    });
    if (user.length > 0) {
      return res.send({
        success: true,
        user,
      });
    } else {
      return res.status(404).send({
        success: false,
        msg: "This user is not found",
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

const userUpdate = async (req, res) => {
  try {
    const userId = +req.user.id;
    const { name, phoneNumber, password, email, location } = req.body;

    // Validate phone number format
    const phoneNumberPattern = /^07\d{9}$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
      return res.send({
        success: false,
        msg: "Invalid phone number format",
      });
    }

    // Update user information
    const updates = {};
    if (name) updates.name = name;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (password) updates.password = bcrypt.hashSync(password, 10);
    if (email) updates.email = email;
    if (location) updates.location = location;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    return res.send({
      success: true,
      updatedUser,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "An error occurred while updating user profile",
    });
  }
};

const adminView = async (req, res) => {
  const userId = +req.user.id;
  try {
    const checkAdmin = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (checkAdmin.isAdmin === true) {
      let user = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          email: true,
          location: true,
          isAdmin: true,
        },
      });
      if (user.length > 0) {
        return res.send({
          success: true,
          user,
        });
      } else {
        return res.status(404).send({
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

module.exports = { register, login, userView, adminView, userUpdate };
