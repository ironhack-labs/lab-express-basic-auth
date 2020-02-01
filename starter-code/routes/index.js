const express = require('express');
const router  = express.Router();

const {
  indexView,
  SignUpView,
  SignUpPost,
  LogInView,
  LogInPost,
  MainView,
  LogOut,
  PrivateView
}=require('../controllers/index.controller')

const {isLog}=require('../middlewares/index')


/* GET home page */
router.get('/', indexView);

router.get('/sign-up',SignUpView);
router.post('/sign-up',SignUpPost);
router.get('/log-in',LogInView);
router.post('/log-in',LogInPost);
router.get('/main',isLog,MainView);
router.get('/private',isLog,PrivateView);
router.get('/log-out',LogOut);


module.exports = router;
