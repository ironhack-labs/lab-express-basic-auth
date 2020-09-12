const checkLogin = (req,res,next) =>{
    if(req.session.user){
        next()
    }else {
        res.send('for loggedin user')
    }
}

module.exports = checkLogin