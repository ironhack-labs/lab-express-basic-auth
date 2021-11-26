const bcryptjs = require("bcryptjs");
const User = require("./../models/User.model");

exports.viewRegister = async (req, res) => {
  res.render("auth/signup");
};

exports.register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Validacion
  //A) Verificar que username y password tengan contenido
  if (!username || !password) {
    res.render("auth/signup", {
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
    res.redirect("/auth/login");
  } catch (error) {
    res.status(500).render("/", {
      errorMessage: "Error en la validacion del username. Intenta nuevamente",
    });
  }
};

//LOGIN
//1.Vista
exports.viewLogin = async (req, res) => {
  res.render("auth/login");
};

//2.Obtener datos del form
exports.login = async (req, res) => {
  //Implementar un manejo de errores-->try, catch

  try {
    // 1. OBTENCIÓN DE DATOS DEL FORMULARIO
    //Dos datos neceesarios para logearse: username y password
    //Obtenerlos del body
    const username = req.body.username;
    const password = req.body.password;

    // 2. VALIDACIÓN DE USUARIO ENCONTRADO EN BD
    //a)buscar username en la base de datos, mediante el metodo finOne
    const foundUser = await User.findOne({ username });
    //qué pasa si no lo encuentra?
    if (!foundUser) {
      //Enviar mensaje de Error y redireccionar a la pagina de login
      res.render("auth/login", {
        errorMessage: "Usuario o contraseña sin coincidencia.",
      });
      //finaliza la funcion
      return;
    }

    // 3. VALIDACIÓN DE CONTRASEÑA
    //comparamos el password ingresado por el user y el password de la DB
    const verifiedPass = await bcryptjs.compareSync(
      password,
      foundUser.passwordEncriptado
    );

    if (!verifiedPass) {
      res.render("auth/login", {
        errorMessage: "Usuario o contraseña errónea. Intenta nuevamente.",
      });
      return;
    }
    // 4.GENERAR LA SESIÓN
    //PERSISTENCIA DE IDENTIDAD
    req.session.currentUser = {
      _id: foundUser._id,
      username: foundUser.username,
      mensaje: "Identifique un inicio de sesion",
    };
    // 5. REDIRECCIONAR AL MAIN
    res.redirect("/users/main");
  } catch (error) {}
};

exports.logout = async (req, res) => {
  res.clearCookie("session-token");
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }

    res.redirect("/");
  });
};
