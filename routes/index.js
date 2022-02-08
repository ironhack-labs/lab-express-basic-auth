const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET sign up page */
router.get("/signup", async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error);
  }
});

/* POST sign up page */

router.post("/signup", async (req, res) => {
  // 1. VERIFICAR QUE LOS DATOS DEL FORMULARIO LLEGUEN AL CONTROLLER
  const { username, email, password } = req.body;

  // --- VALIDACIONES ---
  // A. VERIFICAR QUE NO HAYA ESPACIOS VACÍOS
  if (!username || !email || !password) {
    return res.render("/signup", {
      errorMessage: "Todos los campos deben llenarse.",
    });
  }

  // B. QUE LA CONTRASEA SEA SÓLIDA (Al menos 6 caracteres, un número, una minúscula y una mayúscula)
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    return res.render("/signup", {
      errorMessage:
        "Tu contraseña debe incluir 6 caracteres, al menos un número, una minúscula y una mayúscula.",
    });
  }

  // 2. ENCRIPTAR CONTRASEÑA
  // A. ¿Cuántas veces vamos a revolver la contraseña?
  const salt = await bcryptjs.genSalt(10);

  // B. Revolver la contraseña con el "salt"
  const hashedPassword = await bcryptjs.hash(password, salt);

  // C. GUARDAR EN BASE DE DATOS

  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log(newUser);

    return res.redirect("/profile");
  } catch (error) {
    console.log(error);

    console.log(error.errors);

    // CONFIRMAR SI EL ERROR VIENE DE BASE DE DATOS
    if (error instanceof mongoose.Error.ValidationError) {
      return res.render("/signup", {
        errorMessage: "Por favor utiliza un correo electrónico real.",
      });
    }

    return;
  }
});

/* GET profile page */
router.get("/profile", async (req, res) => {
  try {
    res.render("profile");
  } catch (error) {
    console.log(error);
  }
});

/* GET sign in page */
router.get("/login", async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
