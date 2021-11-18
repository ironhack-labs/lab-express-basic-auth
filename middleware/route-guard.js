// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
    if (!req.session.loggedUser) {
        return res.redirect('users/login');
    }
    next();
};

module.exports = {
    isLoggedIn
};
