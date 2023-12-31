const isLogged = (req,res,next) => {
    if (req.session.currentUser){
        next()
      } else {
        res.redirect('/auth/login')
      }
}

const cantIfIsLogged = (req, res, next) => {
    if (req.session.currentUser){
        res.redirect('/auth/userprofile')
    } else {
        next()
    }
}

module.exports= {isLogged, cantIfIsLogged}