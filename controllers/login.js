const User = require("../models/User.model");
const bcrypt = require("bcrypt");

exports.loadLoginPage = async (req, res) => {
  res.render("login");
};

exports.logInUser = async (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return res.render("login", { error: "Missing fields" });
  }
  const user = await User.findOne({ email });
  //   console.log(user);
  //   console.log(req.session);
  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.redirect("/main");
  } else {
    return res.render("login", { error: "ERROR!" });
  }
};
