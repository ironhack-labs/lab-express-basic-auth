const bycrypt = require("bcrypt");
const User = require("../models/user");

exports.getSignup = (req, res) => {
  res.render("auth/signup");
};
exports.postSignup = async (req, res) => {
  const { username, password } = req.body;
  const salt = bycrypt.genSaltSync(10);
  const hashPassword = bycrypt.hashSync(password, salt);

  //revisar si eel usario ya existe
  const users = await User.find({ username });

  if (users.length !== 0) {
    return res.render("auth/signup", {
      errorMessage: "User already exists"
    });
  }
  //revisar si tenemos usario y contrasena (si no esta vacio)
  if (username === "" || password === "") {
    return res.render("auth/signup", {
      errorMessage: "Empty fields"
    });
  }
  //crear al usuario en la base de datos.
  await User.create({ username, password: hashPassword });
  res.redirect("/");
};
exports.getLogin = (req, res) => {
  res.render("auth/login");
};
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  //verificar si recibimos usuario y contrasena si no estan vacios
  if (username === "" || password === "") {
    return res.render("auth/login", {
      errorMessage: "empty"
    });
  }
  //verificamos si hay un usuario con ese username
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("auth/login", {
      errorMessage: "No such user"
    });
  }
  //comparamos la contrasena
  if (bycrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.redirect("/");
  } else {
    res.render("auth/login", {
      errorMessage: "invalid password"
    });
  }
};
