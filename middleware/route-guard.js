
function isLoggedIn(req, res, next) {
    if(!req.session.user) {
        return res.redirect("/auth/login")

    }
    next()
}

function checkForRole(req, res, next) {
    if(req.session.user.role === "admin") {
        res.redirect("/private")
    }
    else{res.redirect("/public")}
}

module.exports = {
    isLoggedIn,
    checkForRole
}