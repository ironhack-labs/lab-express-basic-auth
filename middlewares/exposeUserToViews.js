//*check for loggedin user

const exposeUsers = ((req, res, next) => {
    if (req.session.currentUser) {
        res.locals.cuurentUser = req.session.currentUser;
        res.locals.isLoggedIn = true;
    }
    next(); //! next() is needed here to continue with the execution
});

module.exports = exposeUsers;