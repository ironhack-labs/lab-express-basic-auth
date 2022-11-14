const app = require("../app")

function loggedIn(req, res, next) {
    if (req.session.currentUser) {

        next()
    } else {
        res.render('auth/log-in', { errorMessage: 'Init session required' })
    }


}


function loggedOut(req, res, next) {

    if (!req.session.currentUser) {


        next()
    } else {
        res.redirect('/main')
    }

}

module.exports = {
    loggedIn,
    loggedOut
}
