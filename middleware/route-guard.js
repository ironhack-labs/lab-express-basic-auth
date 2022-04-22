
//checks if user is logged in when trying to access specific areas.
const isLoggedIn = (req, res, next) => {
    if(!req.session.currentUser) {
        return res.redirect('/login');
    }
    next();
};

//if user is already loggin in and tried to acces the login page
//it redirects the user to the home page

const isLoggedOut = (req, res, next) => {
    if(req.session.currentUser) {
        return res.redirect('/');
    }
    next();
};

module.exports = {
    isLoggedIn,
    isLoggedOut
};
