const UserController = require('../controller/User.controller');
const { route } = require('./index.routes');
const router = require('express').Router();

router.get('/signin', UserController.signinGET);
router.post('/signin', UserController.signinPOST);
router.get('/login', UserController.loginGET);
router.post('/login', UserController.loginPOST);
router.get('/profile', UserController.profileGET);
router.get('/main', UserController.mainGET);
router.get('/private', UserController.privateGET);

module.exports = router;