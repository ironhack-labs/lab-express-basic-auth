const Users = require("../models/User.model")
const bcrypt = require("bcrypt")
const { Error } = require("mongoose")

//Errors validation 
const isMongooseValidationError = (error) =>
  error instanceof Error.ValidationError;

//Error usuario repetido
const isMongoError = ({ code: errorCode }) => errorCode === 11000;





const showFormSignUp = async (req,res,next)=>{
  res.render("signup")
}
const showFormLogin = async (req,res,next)=>{
  res.render("login")
}

const userLogin = async(req,res,next) => {
  if(req.session.currentUser){
    return next()
  }
  res.redirect("/login")
} 

const main = async(req,res,next) =>{
  res.render("main")
}
const private = async(req,res,next) =>{
  res.render("private")
}
const hasCorrectPasswordFormat = (password) => {
  const passRegEx = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/);
  return passRegEx.test(password);
}

const signUp = async (req,res,next)=>{
try{
  const {email, password} = req.body;
  const isMissingCredentials = !email || !password;
  if (isMissingCredentials){
    return res.send("Missing credentials")
  }
  if (!hasCorrectPasswordFormat){
    return res.send("Incorrect format password")
  }
  // const user = await Users.findOne({email})
  // if(user){
  //   res.send("Usuario ya existe") 
  // }

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await Users.create({
    email,
    password: hashedPassword
  })
  console.log(user)
  res.send("usuario creado")
  }catch(e){
    console.log(e)
    if(isMongoError(e)){
      res.render("signUp", {message: "Usuario ya existe"})
    }
    if(isMongooseValidationError(e)){
      res.render("signUp", {message: "Problema de validacion"})
    }
  }
}

const login = async (req,res) => {
  try{
    const {email, password} = req.body;
    const isMissingCredentials = !email || !password;
    if (isMissingCredentials){
      return res.send("Missing credentials")
    }
    const user = await Users.findOne({email});
    if(!user){
      res.send("User does not exist. Please signup")
    }
    const verifypassword = await bcrypt.compare(password, user.password)
    if (!verifypassword){
      res.send("Invalid credentials. Try again.")
    }
    req.session.currentUser = user._id
    console.log(req.session)
    return res.send("Login successfully")
  } catch(e){
    console.error(e)
  }
}

module.exports = {signUp, showFormSignUp, showFormLogin, login, main, userLogin, private}