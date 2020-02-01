
const bcrypct = require("bcrypt")
const User = require ('../model/User')


exports.indexView = (req, res, next) =>  
res.render('index');
;

exports.signupView = (req, res, next) => { 
  const config = {
    action: 'signup', 
    register: true,
}
res.render('form', config);
};

exports.loginView = (req, res, next) => {
  const config = {
    action: 'login',
    register: false
  }
  res.render('form', config)
}

exports.signupPost =async (req, res, next) => { 
  const {username, password, password_verify} = req.body
  const config = {
    action: 'signup',
    register: true
  }
  if(password !== password_verify){
  config.err = 'Lo sentimos tu password no es igual, intentalo de nuevo'
  res.render ('form', config)
}else {
const salt = await bcrypt.genSalt(Number(process.env,SALT))
const hashPassword = await bcrypt.hash(password, salt)
const user = await User.create({username, password: hashPassword})
res.redirect('/aunth/login')
}}

exports.loginPost =  async (req, res, next) =>{
  const {username, password} = req.body
  const config = {
   action: 'login',
   register: false,
  }
  const user = await User.findOne({username})
  if (!user){
    config.err = 'Intenta de nuevo, nosotros creemos en ti'
    res.render('form', config)
  }else{
    const trusted = await bcrypt(password, user.password)
    if(trusted){
      req.session.loggedUser = user
      req.app.locals.loggedUser = user
      res.redirect('/profile')
    }else{
      config.err = 'Sorry, intenta de nuevo querido usuario'
      res.render('form', config)
    }
  }
} 


exports.profileView = (req, res, next) => 
res.render('private')

exports.logout = (req, res, next) => 
res.render('main')





