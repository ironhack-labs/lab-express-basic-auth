// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/auth/login');
        return
    }
    next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
const isLoggedOut = (req, res, next) => {
    if (req.session.currentUser) {
        res.redirect('/');
        return
    }
    next();
};

module.exports = {
    isLoggedIn,
    isLoggedOut
};
