const bindUser = (req, res, next) => {
    res.locals.user = req.session.currentUser;
    next();
}

module.exports = bindUser