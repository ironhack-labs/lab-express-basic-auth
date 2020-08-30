const bcrypt = require("bcrypt");
const User = require("../models/User.model");

exports.getHomeRoute = async (req, res) => {
  res.render("index");
};

exports.postHomeRoute = async (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return res.render("index", { error: "ERROR" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.render("index", {
      error: "An user with that mail address is already registered",
    });
  }
  const salt = bcrypt.genSaltSync(12);
  const hashpwd = bcrypt.hashSync(password, salt);

  await User.create({
    email,
    password: hashpwd,
  });
  res.render("index", { confirmation: "ACCOUNT CREATED!" });
};
