const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { Error } = require("mongoose");

const hasCorrectPassword = (password) => {
  const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
  return passwordRegex.test(password);
};

const isMongooseValidationError = (error) =>
  error instanceof Error.ValidationError;

const isMongoError = ({ code: errorCode }) => errorCode === 11000;

const signIn = async (req, res, next) => {
  try {
    const { user, password, email } = req.body;
    //console.log(user,password,email);
    const missingCredentials = !password || !email || !user;
    if (missingCredentials) {
      return res.send("missing credentials");
    }
    if (!hasCorrectPassword(password)) {
      return res.send("incorrect password format");
    }

    const usuario = User.findOne({ username: user }).lean();
    if (!usuario) {
      return res.send("user already exist");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { passwordHash, ...rest } = await User.create({
      email,
      passwordHash: hashedPassword,
      username: user,
    });
    //console.log("user", rest);
    res.redirect("/logIn");
  } catch (err) {
    if (isMongooseValidationError(err)) {
      console.error(err);
      return res.send("validation error: " + err.message);
    }

    if (isMongoError(err)) {
      return res.send("mongo error: " + err.message);
    }

    console.error(err);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { user, password } = req.body;

    
    console.log(user, password);
  } catch (err) {
    console.error(err);
  }
};

const logOut = async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err);
  }
};

module.exports = { logIn, signIn, logOut };
