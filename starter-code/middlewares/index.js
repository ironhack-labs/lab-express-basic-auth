
exports.islogged = (req, res, netx)=>{
  if(req.session.loggedUser){
    next()
  }else{
    const config= {
      action:"login",
      register:true
    }
    res.redirect("auth/signup")
  }
}
