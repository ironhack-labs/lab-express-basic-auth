const User = require('../models/users');


function emptyFields(req,res,next){
  const {username, password} = req.body;
  if(!username || !password) {
    res.render("users/signup",  {error: "No puede estar el campo vacío"})  
  } else {
    next();
  } 
}

function isLogged (req,res,next){
  const user =req.session.currentUser;
  if(!user){
    res.redirect('/users/login');
  } else{ next()}
}
function isAnon (req,res,next){
  const user =req.session.currentUser;
  if(user){
    res.redirect('/users/profile');
  } else{ next()}
}
function isCreated (req,res,next){
  const {username} = req.body;
  User.findOne({username})
  .then((user) =>{
    if(user){
      res.render("users/signup",  {error: "El usuario ya existe, sea original"})  
    }else {
      next();
    }
  })
  .catch(next)
}

module.exports= {
  emptyFields,
  isLogged,
  isAnon,
  isCreated
}