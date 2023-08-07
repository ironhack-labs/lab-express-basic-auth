const express = require('express')
const { isloggedIn } = require('../../middlewares/route-guard')
const router = express.Router()


router.get('/page1', isloggedIn, (req, res) => {

    console.log('User logged', req.session.currentUser)
    res.render('page1', { loggedUser: req.session.currentUser })
})

router.get('/page2', isloggedIn, (req, res) => {
    console.log('User looged', req.session.currentUser)
    res.render('page2', { loggedUser: req.session.currentUser })
}
)

module.exports = router