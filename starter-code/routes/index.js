const express = require('express');
const router  = express.Router();
const {
  signupView,
  signupProcess,
  loginProcess, 
  secretView, 
  logout,
  loginView
} = require('../controllers/index')

const checkSession = require("../middlewares/checkSession")
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/secret", checkSession, secretView)

router.get('/main', checkSession, secretView)
router.get('/private', checkSession, secretView)

router.get("/signup", signupView);
router.post("/signup", signupProcess);

router.get("/login", loginView);
router.post("/login", loginProcess);

router.get("/logout", logout);
module.exports = router;
