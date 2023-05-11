let isLoggedIn = (req,res,next) =>{
    if(!req.session.currentUser){
      return res.redirect('/login');  
    }
    next();
}

let isLoggedOut = (req, res, next)=>{
    if(req.session.currentUser){
        return res.redirect('/');
    }
    next();
};

module.exports = {
    isLoggedIn, 
    isLoggedOut
};