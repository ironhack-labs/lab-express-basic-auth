module.exports.isAuthenticated= ( req,res,next) => {
    // para saber si esta autenticado
  //  const autheticated = true;
  //  if (autheticated) {
    if (req.currentUser){
        next() 
    } else {
        res.redirect("/login")
    }
}
module.exports.isNotAuthenticated= ( req,res,next) => {
    // para saber si esta autenticado
   // const autheticated = false;
    //if (!autheticated) {
        if (!req.currentUser){
        next()
    } else {
       // res.redirect("/")
       res.redirect("/profile")
    }
}