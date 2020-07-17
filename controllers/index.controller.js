module.exports.renderPrivate = (req, res, next) => {
    if (req.session.userId) {
        res.render('private');
    }
    else {
        res.send('Not authorized')
    }
}