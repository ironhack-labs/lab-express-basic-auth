const express = require('express');
const router = express.Router();
const { profile, secret } = require("../controllers/profile.controller")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get("/profile", profile)
router.get("/profile/secret", secret)


module.exports = router;
