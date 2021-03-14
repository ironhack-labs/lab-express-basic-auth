module.exports = function protectRoute(req, res, next) {
    if (req.session.currentUser) next(); // if user is logged in ... pass the ball
    else res.redirect("/signup"); // else block and redirect to signin page
}