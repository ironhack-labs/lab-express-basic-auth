const router = require("express").Router();
const { isAuthorized } = require('../middleware/route-guard')

router.get('/main', isAuthorized, (req,res,next) => {
    res.render('../views/main')
})

module.exports = router;