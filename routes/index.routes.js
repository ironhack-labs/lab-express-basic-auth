const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

/* GET private routes */

router.get("/main", (req, res, next) => {
	res.render("users/main", { userInSession: req.session.currentUser });
});

router.get("/private", (req, res, next) => {
	res.render("users/private", { userInSession: req.session.currentUser })
});

module.exports = router;
