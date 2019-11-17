const bcrypt = require("bcrypt");
const User = require("../models/User");
exports.home =  (req, res, next) => {
  res.render('index');
}

exports.signup = (req, res) => {
  res.render('signup');
}

exports.signupProcess = (req, res) => {
  const {username, password} = req.body;
  console.log(username,password)
  if(username ==="" ||  password ==="") {
    res.render('signup',{errorMessage:"Username and password required"})
  }
  User.findOne({username}).then((user) =>{
    if (!user) {
    //configure
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    User.create({
      username:username,
      password:hashPassword
    })
  .then(()=> {
    res.redirect('/');
  }).catch(err => console.log(err))
    } else {
      res.render('signup', {errorMessage:"User already in use"})
    }
  }).catch(error => console.log(error))
}

exports.login = (req, res) => {
  res.render("login")
}

exports.loginProcess = async (req, res) => {
  // 1. extraemos la información de req.body
  const { username, password } = req.body;
  // 2. verificamos que no nos envien campos vacios
  if (username === "" || password === "") {
    res.render("login", { errorMessage: "Error: Missing fields" });
  }
  // 3. Verificar si el correo está registrado, si lo está intentamos logear: verificamos si las contraseñas coinciden
  const user = await User.findOne({ username });
  if (!user) {
    res.render("login", { errorMessage: "Error: Username doesn't exists" });
  } else{
      // 4. verificar si la contraseña es correcta
  if (
    bcrypt.compareSync(password, user.password)) {
    //Todo caso de éxito, inicio la sesión
    req.session.currentUser = user;
    res.redirect("/");
  } else {
    //todo error, contraseña incorrecta
    res.render("login", { errorMessage: "Error: Incorrect Password" });
  }
  }
};

exports.main = (req, res) => {
  res.render("main");
}

exports.private = (req, res) => {
  res.render("private")
}


exports.logout =  async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
}

module.exports;