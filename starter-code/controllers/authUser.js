const bcrypt = require("bcrypt");
const User = require("../models/User");


/* SING UP PROCESS */
exports.signupView = (req, res) => {
  res.render("auth/signup");
};

exports.signupProcess = (req, res) => {
  const { email, password } = req.body;

  if( email === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Credenciales requeridas"
    });
  }

  User.findOne({ email })
  .then( user => {
    if(!user) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      User.create({
        email,
        password: hashPassword
      })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => console.log(err));
    } else {
      res.render("auth/signup", { errorMessage: "Email en uso" });
    }
  })
  .catch(err => { 
    console.log(err);
  });
};


/* LOGIN PROCESS */
exports.loginView = async (req, res) => {
  res.render("auth/login");
}

exports.loginProcess = async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === ""){
    res.render("auth/login", { errorMessage: "Error: missing fields" });
  }

  const user = await User.findOne( { email });
  if(!user) {
    res.render("auth/login", { errorMessage: "Error: email doesn't exist"});
  }

  if( bcrypt.compareSync ( password, user.password )) {
    req.session.currentUser = user;
    res.redirect("/private");
  } else {
    res.render("auth/login", { errorMessage: "Error: Incorrect Password"})
  }
};

/* PRIVATE VIEWS */
exports.privateView = (req, res) => {
  res.render("private");
}

exports.mainView = (req, res) => {
  res.render("main");
}

/* LOGOUT */

exports.logout = async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
}