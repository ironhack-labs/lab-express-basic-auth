exports.isLog=(req,res,next)=>{
  req.session.loggedUser ? next() : res.redirect('/log-in')
}