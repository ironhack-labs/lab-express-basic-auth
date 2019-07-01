const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.getSignup = (req, res) => {
  res.render("auth/signup");
};

exports.postSignup = async (req, res) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  const users = await User.find({ username });

  if (users.length !== 0) {
    return res.render("auth/signup", {
      errorMessage: "Ya existe"
    });
  }

  if (username === "" || password === "") {
    return res.render("auth/signup", { errorMessage: "escribe algo" });
  }

  await User.create({ username, password: hashPassword });

  res.redirect("/");
};

exports.getLogin = (req, res) => {
  res.render("auth/login");
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.render("auth/login", {
      errorMessage: "no existes"
    });
  }
  if (username === "" || password === "") {
    return res.render("auth/login", {
      errorMessage: "escribe algo"
    });
  }

  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.redirect("/");
  } else {
    res.render("auth/login", {
      errorMessage: "wrong password"
    });
  }
};
