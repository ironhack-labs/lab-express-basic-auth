const express = require('express');
const router = express.Router();


const {
  signupView,
  signupProcess,
  loginView,
  loginProcess,
  userSesion

} = require("../controllers/authUser");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/signup', signupView);
router.post('/signup', signupProcess);
router.get('/login', loginView);
router.post('/login', loginProcess);
router.get('/sesion-open', userSesion);



module.exports = router;