const bcrypt = require("bcryptjs");
const NewUser = require("../models/User.model");
const { Error } = require("mongoose");


const signUpView = (req, res) => {  // render gignup form page 
  res.render("signup")
}

const logInView = (req, res) => {  // render login form page 
  res.render("login")
}

const mainView = (req, res) => {  // render main page RUTA PAGINA SEGURA
  res.render("main")
}

const indexView = (req, res) => {  // render index page RUTA PAGINA SEGURA
  res.render("index")
}

const hasCorrectPasswordFormat = password => {
  //min 6 caracteres + un mayus + un numero + minimo una minuscula
  const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
  return passwordRegex.test(password);
}

const isMongooseValidationError = (error) => 
error instanceof Error.ValidationError;

// error = { code 11000, message: "email is not unique"}
const isMongoError = ({ code: errorCode }) => errorCode === 11000;


const checkCredentials = (req, res, next) => {  // check en metodo post existe usuario?
  const { password, user, email } = req.body;
  const hasMissingCredential = !user || !password || !email;
  if (hasMissingCredential) {
    return res.send("credentials missing");
  }
  next();
};

const signup = async (req, res) => {
  try {
    const { password, user, email } = req.body;
    console.log(email)
    const isAlreadyUser = await NewUser.findOne({ email });
    
    if (isAlreadyUser) {
      return res.send("user already exists");
    }
    if(!hasCorrectPasswordFormat(password)){
      return res.send("incorrect password format")
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    const user2 = await NewUser.create({ user, email, passwordHash: hashPassword })
    console.log("user", user2);

    req.session.currentUser = user._id // persistimos la session si se logea correctamente
    res.send("user created successful");

  } catch (err) {
   if (isMongooseValidationError(err)) {
     return res.send("validarion error", err.message)
   }
   if(isMongoError(err)) {
     return res.send("mongo error" + err.message)
   }
   console.error(err);
  }
};


// tenemos que persisitir la informacion del usuario en la sesion con: req.session.currentUser = user._id <<<----- OJO NO EXPONER LA PASS AQUI
const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await NewUser.findOne({ email });
    if (!user) {
      return res.send("user does not exist");
    }
    const verifyPassword = await bcrypt.compare(password, user.passwordHash); // comparamos password con hash password de la data base
    if (!verifyPassword) {
      return res.send("wrong credentials");
    }
    req.session.currentUser = user._id // persistimos la sesion
    return res.redirect("/main");
  } catch (err) {
    console.log(err);
  }
};

const userSecureRoute = (req, res, next) => {  
  const isUser = req.session.currentUser 
  if (!isUser) {
    res.redirect("/login")
   // res.send("create acc first");
  }
  next();
};

const logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/")
};




module.exports = { 
  signup, 
  checkCredentials, 
  signUpView, 
  login, 
  logout, 
  logInView, 
  mainView,
  userSecureRoute,
  indexView,
 };