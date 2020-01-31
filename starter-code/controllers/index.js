require('dotenv').config()
const bcrypt=require('bcrypt')
const User=require('../models/User')


exports.signupGet=(req,res)=>{
  const parametros={
    action:'signup',
    registering:true
  }
  res.render('form',parametros)
}
exports.signupPost=async (req,res)=>{
  const {username,password}=req.body
  const parametros={
    action:'signup',
    registering:true
  }
  const otroUsuario= await User.findOne({username})
  if (otroUsuario){
    parametros.err="Username already used"
    res.render('form',parametros)
  }else{
    const salt=await bcrypt.genSalt(Number(process.env.SALT))
    const hashPassword=await bcrypt.hash(password,salt)
    const user=await User.create({username,hashPassword})
    res.redirect('/login')
  }
}
exports.loginGet=(req,res)=>{
  const parametros={
    action:'login',
    registering:false
  }
  res.render('form',parametros)
}
exports.loginPost=(req,res)=>{
  const {username,password}=req.body
  const parametros={
    action:'login',
    registering:false
  }
  const user=await User.findOne({username})
  if (!user){
    parametros.err="Wrong information"
    res.render('form'),parametros
  }else {
    const comparacion= await bcrypt.compare(password,user.password)
    if ( comparacion) {
      req.session.loggedUser = user
      req.app.locals.loggedUser = user
      res.redirect('/private')
    }
    else 
    {
      parametros.err="Wrong information"
      res.render('form'),parametros
    }
  }
}