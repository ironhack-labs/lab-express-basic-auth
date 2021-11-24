const bcryptjs = require("bcryptjs");
const User = require("./../models/User.model");

exports.viewRegister = async (req, res) => {
  res.render("index");
};

exports.register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Validacion
  //A) Verificar que username y password tengan contenido
  if (!username || !password) {
    res.render("index", {
      errorMessage: "Uno o mas campos estan vacios. Revisalos nuevamente",
    });
  }

  //2.Ecriptacion de password
  try {
    const salt = await bcryptjs.genSalt(10);
    const passwordEncriptado = await bcryptjs.hash(password, salt);

    const newUser = await User.create({
      username,
      passwordEncriptado,
    });
    //redireccion de usuario
    res.redirect("/");
  } catch (error) {
    res.status(500).render("/", {
      errorMessage: "Error en la validacion del username. Intenta nuevamente",
    });
  }
};
