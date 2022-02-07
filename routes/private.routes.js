const router = require("express").Router();
const { isAuthorized } = require('../middleware/route-guard')

router.get('/private', isAuthorized, (req, res, next) => {
    res.render('../views/private')
})

module.exports = router;