const express = require('express');
const router  = express.Router();

const {
  mainView,
  signupView,
  signupProcess,
  loginView,
  loginProcess,
  privateView,
  sessionProcess
 
} = require("../controller/authUser");

const checkSession = require("../middlewares/checkSession");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// autenticacion para pagina privada//
// router.get("/main", checkSession, mainView);
router.get("/private", sessionProcess);

/* auth Routes */

router.get("/signup", signupView);
router.post("/signup", signupProcess);
router.get("/login", loginView);
router.post("/login", loginProcess);
router.get("/main", mainView);
router.get("/private", privateView)



module.exports = router;

