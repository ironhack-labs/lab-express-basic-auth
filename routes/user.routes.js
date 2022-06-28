const router = require("express").Router()

router.get('/myprofile', (req, res) => {
    res.render('user/myprofile', {user: req.session.currentUser})
})


module.exports = router