const express = require('express');
const router  = express.Router();

const {
  signupView,
  signupProcess,
  loginView,
  loginProcess,
  privateView,
  mainView,
  logout
} = require("../controllers/authUser"); 


const checkSession = require("../middlewares/checkSession")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* PRIVATE VIEWS */
router.get("/private", checkSession, privateView);
router.get("/main", checkSession, mainView);

/* auth Routes */
router.get("/signup", signupView);
router.post("/signup", signupProcess);

router.get("/login", loginView);
router.post("/login", loginProcess);

router.get("/logout", logout);


module.exports = router;


