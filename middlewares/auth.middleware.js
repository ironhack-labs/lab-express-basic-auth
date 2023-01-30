module.exports.isAuthenticated= ( req,res,next) => {
    // para saber si esta autenticado
  //  const autheticated = true;
  //  if (autheticated) {
    if (req.currentUser){
        next() // esta autenticado? pasa al siguiente middleware, pasa al profile (verlo en la ruta) - estoy protegiendo la vista del perfil al unico usuario que este autenticado
    } else {
        res.redirect("/login") // si no esta autenticado paso al login 
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