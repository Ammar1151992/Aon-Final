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
      return res.send({
        success: false,
        msg: "This number is not exsit, please register it",
      });
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
        return res.send({
          success: false,
          msg: "The password is incorrect, try again!",
        });
      }
    }
  } else {
    return res.send({
      success: false,
      msg: "This number is not exsit, please register it",
    });
  }
};

module.exports = { register, login };
