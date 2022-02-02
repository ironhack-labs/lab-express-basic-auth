//redirects the user to the login page if not logged in with a nice message.

const loggedIn = (req, res, next) => {
    if (!req.session.currentUser){
    return res.render('user/login', { errorMessage: 'please log in before visiting this page' });
    }
    next();
};

module.exports = {loggedIn}