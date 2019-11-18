const express = require('express');
const router = express.Router();


const {
  signupView,
  signupProcess,
  loginView,
  loginProcess,
  userSesion,
  userMain,
  userPrivate
} = require("../controllers/authUser");

const
  checkSesion = require("../middleware/checkSesion");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/signup', signupView);
router.post('/signup', signupProcess);
router.get('/login', loginView);
router.post('/login', loginProcess);

router.get('/sesion-open', userSesion);
router.get('/main', userMain);
router.get('/private', userPrivate);
/* sesiones verificadas */
// router.get('/sesion-open', userSesion);
// router.get('/main', checkSesion, userMain);
// router.get('/private', checkSesion, userPrivate);


module.exports = router;