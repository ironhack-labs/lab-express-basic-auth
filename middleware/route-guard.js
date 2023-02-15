//for the log IN part, to check if the user is already logged in:
let isLoggedIn = (req,res,next) => {
    //we check first if the user isn't logged in. if that's the case, then we redirect him to the loginpage instantly
    if(!req.session.user) {
        //if session is OFF, then redirected to the login page
        res.redirect('/login');
        next();
    }
};

//for the log OUT, we check if the user is alreadu logged out:
let isLoggedOut = (req,res,next) => {
    //we check, if the user is already logged in, then he's directed to the home page
    if(req.session.user) { //if session is ON, then redirected to home page


        res.redirect('/');
        next();
    }
}

//we export anywhere these 2 middlewares
module.exports = {isLoggedIn, isLoggedOut};
