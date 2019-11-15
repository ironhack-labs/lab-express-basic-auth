const express = require('express');
const router  = express.Router();

const {signupProcess, loginProcess} = require("../controllers/index")

const checkSession = (req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
};

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res, next) => res.render('signup'));
router.post("/signup", signupProcess)

router.get('/login', (req, res, next) => {res.render('login');});
router.post("/login", loginProcess)

router.get("/main", checkSession, (req, res) => res.render("main"))

router.get("/private", checkSession, (req, res) => res.render("private"))

module.exports = router;
