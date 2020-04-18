const bcrypt = require("bcrypt")
const User = require("../models/User")

exports.signupView = (req, res) => {
    res.render("auth/signup");
  };

  exports.signupProcess = async (req, res) => {
    // 1. obtener la niformacion del formulario
    const { email, password } = req.body;
    //2. verificar que recibi la informacion correcta (no me mandaron algo vacio kbrones)
    if (email === "" || password === "") {
      return res.render("auth/signup", {
        error: 
        "Favor de registrar un usuario y contraseña válidos.",
      });
    }
    //3. Verificar si existe un usuario con ese correo
    const userInDB = await User.findOne({ email });
  
    if (userInDB) {
      return res.render("auth/signup", {
        error:
          "Usuario ya registrado.",
      });
    }
    //4. Hashear la contrasena
    //4.1 Generar el salt
    const salt = bcrypt.genSaltSync(12);
    const hashPass = bcrypt.hashSync(password, salt);
  
    //5. si existe devolver un error, si no creamos al usuario
  
    await User.create({
      email,
      password: hashPass,
    });
    // 6. responder al usuario
    res.redirect("/");
  };
