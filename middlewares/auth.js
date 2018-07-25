const requireUser = (req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/login');
    }
};

const requireAnom = (req, res, next) => {
    if (!req.session.currentUser) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = {
    requireUser,
    requireAnom
};