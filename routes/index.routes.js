const express = require('express');
const router = express.Router();

const { main, private } = require("../controllers/private")

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get("/profile", main)
router.get("/profile/private", private)

module.exports = router;