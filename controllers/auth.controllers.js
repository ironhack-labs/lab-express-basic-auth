const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const checkCredentials = (req, res, next) => {
  const { password, email } = req.body;
  const hasMissingCredential = !password || !email;
  if (hasMissingCredential) {
    return res.send("credentials missing");
  }
  next();
};

const signup = async (req, res) => {
  try {
    const isAlreadyUser = await User.findOne({ email });
    if (isAlreadyUser) {
      return res.send("user already exists");
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ email, hashPassword });
    console.log("user", user);
    res.send("user created succesfully");
  } catch (err) {
    console.error(err);
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("user does not exist");
    }
    const verifyPassword = await bcrypt.compare(password, user.hashPassword);
    if (!verifyPassword) {
      return res.send("wrong credentials");
    }
    return res.send("login succesfull");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { login, signup, checkCredentials };
