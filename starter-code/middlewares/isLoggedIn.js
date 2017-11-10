module.exports = (req,res,next) =>{
  if(req.session.currentUser){
    console.log("entra GG")
    next();
  }else{
      res.redirect('/');
  }
};
