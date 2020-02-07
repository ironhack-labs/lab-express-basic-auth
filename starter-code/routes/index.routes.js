const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index'))



router.use((req, res, next) => req.session.currentUser ? next() : res.redirect("/login"))


router.get("/main", (req, res) => res.render("main"));
router.get("/private", (req, res) => res.render("private"));


module.exports = router
