const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

    res.render("profile/panel-de-control")
})


module.exports = router;