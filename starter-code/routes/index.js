const express = require('express');
const router  = express.Router();

const {
  home,
  signup,
  signupProcess,
  login,
  loginProcess,
  secretView, 
  main,
  private,
  logout
} = require('../controllers/indexControllers')
const checkSession = require("../middlewares/checkSession");

/* GET home page */
router.get('/', home);


router.get('/main',checkSession,main)
router.get('/private',checkSession,private)

/* auth Routes */
router.get("/signup", signup);
router.post("/signup", signupProcess);
router.get("/login", login);
router.post("/login", loginProcess);
router.get("/logout", logout)
module.exports = router;
