const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signupView = (req, res) => {
  res.render("auth/signup");
};

exports.signupProcess = (req, res) => {
    const { email, password } = req.body;
  
    if (email === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Correo y contraseña requeridos"
      });
    }
  
    User.findOne({ email })
      .then(user => {
        if (!user) {
          // 1. configurar el salt
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(password, salt);
          User.create({
            email,
            password: hashPassword
         
          })
            .then(() => {
              res.redirect("/");
            })
            .catch(err => console.error(err));
        } else {
          //notificar que el email está en uso
          res.render("auth/signup", { errorMessage: "Email en uso" });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
  
  /* login */
  
  exports.loginView = (req, res) => {
    res.render("auth/login");
  };

  
  exports.loginProcess =  (req, res) => {
    // 1. extraemos la información de req.body
    const { email, password } = req.body;

    // 2. verificamos que no nos envien campos vacios
    if (email === "" || password === "") {
      res.render("auth/login", { errorMessage: "Error: Missing fields" });
    }
    // 3. Verificar si el correo está registrado, si lo está intentamos logear: verificamos si las contraseñas coinciden
   User.findOne({ email })
   .then(user => {
    if (!user) {
      res.render("auth/login", { errorMessage: "Error: Email doesn't exists" });
    }
  
    // 4. verificar si la contraseña es correcta
    if (bcrypt.compareSync(
        password,
        user.password
        /* contraseña hasheada almacenada en el registro del usuario */
      )
    ) {
      // éxito, inicio de la sesión si es usuario y contrasena
      req.session.currentUser;
      res.redirect("/main");
    } else {
      //todo error, contraseña incorrecta
      res.render("auth/login", { errorMessage: "Error: Incorrect Password or user" });
    }

   }) 
   .catch(err =>{
     console.error(err);
   })
  
  };

  //termina funcion del login// 


  exports.mainView = (req, res) => {
    res.render("main");
  };

  exports.sessionProcess = (req, res) =>{
    if( req.session.currentUser === true) {
      res.redirect("/main")

    }else {
      res.render("private")
    }
  }

  
  exports.privateView = (req, res) => {
    res.render("private")
  };


