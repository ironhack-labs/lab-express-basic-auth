require('dotenv').config();
const bcrypt=require('bcrypt');
const User=require('../models/User')


exports.indexView = (req, res, next) => {
  res.render('index');
}

exports.SignUpView=(req,res,next)=>{
  const config={
    action: 'sign-up'
  }
  res.render('form',config)
}

exports.SignUpPost= async(req,res,next)=>{
const {user,password}=req.body;

const salt=await bcrypt.genSalt(Number(process.env.SALT));
const hashPassword=await bcrypt.hash(password, salt)
const userName=await User.create({user,password:hashPassword})
res.redirect('/log-in')
}

exports.LogInView=(req,res,next)=>{
  const config={
    action: 'log-in'
  }
  res.render('form',config)
}

exports.LogInPost= async(req,res,next)=>{
  const config={
    action: 'log-in'
  }
  const {user,password}=req.body;
  const userName=await User.findOne({user})
  if(!userName){
    config.err='Los datos ingresados son incorrectos'
    res.render('form',config)
  }else{
    const checkPass=await bcrypt.compare(password,userName.password)
    if(checkPass){
      req.session.loggedUser = user
      req.app.locals.loggedUser = user
      res.redirect('/main')
    }else{
      config.err='Los datos ingresados son incorrectos'
      res.render('form',config)
    }
  }

}

exports.MainView=(req,res,next)=>{
  res.render('main')
}

exports.PrivateView=(req,res,next)=>{
  res.render('private')
}


exports.LogOut=async(req,res,next)=>{
  await req.session.destroy();
  res.redirect('/');
}