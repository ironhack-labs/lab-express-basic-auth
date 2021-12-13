
const  isLoggedOut= (req,res,next)=>{

    if(!req.session.currentUser){
        return res.redirect("/auth/login")
    }
    next();
}

const  isLoggedIn= (req,res,next)=>{
    if(req.session.currentUser){
        //si existe un usuario ya loggeado en nuestra pagina
        // lo mandamos al homePage
        return res.redirect('/profile')
    }
    next()
}


module.exports = {
    isLoggedIn,
    isLoggedOut
}