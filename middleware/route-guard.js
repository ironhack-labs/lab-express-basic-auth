// Check if the user is logged in 
const isLoggedIn = (req,res,next) =>{
    if(!req.session.currentUser){
      return res.redirect('/login');  
    }
    next();
}

// Check if the user is not logged in 
const isLoggedOut = (req, res, next)=>{
    if(req.session.currentUser){
        return res.redirect('/');
    }
    next();
};

module.exports = {
    isLoggedIn, 
    isLoggedOut
};