const bcrypt = require("bcryptjs");
const NewUser = require("../models/User.model");



const signUpView = (req, res) => {  // render form page 
  res.render("signup")
}



const checkCredentials = (req, res, next) => {  // check en metodo post existe usuario?
  const { password, user, email } = req.body;
  const hasMissingCredential = !user || !password || !email;
  if (hasMissingCredential) {
    return res.send("credentials missing");
  }
  next();
};

const signup = async (req, res) => {
  try {
    const { password, user, email } = req.body;
    console.log(email)
    const isAlreadyUser = await NewUser.findOne({ email });
    
    if (isAlreadyUser) {
      return res.send("user already exists");
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    const user2 = await NewUser.create({ user, email, passwordHash: hashPassword });
    console.log("user", user2);
    res.send("user created succesfully");
  } catch (err) {
    console.error(err);
  }
};



module.exports = { signup, checkCredentials, signUpView };