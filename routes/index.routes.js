const express = require('express');
const router = express.Router();
const signin = require('../controllers/signin.controller')
const sessionMiddleware = require('../middlewares/session.middleware')


/* GET home page */
router.get('/',sessionMiddleware.isAuthenticated, signin.indexRender);
router.get('/signin', signin.signinRender)
router.post('/signin', signin.createUser)
router.get('/sucessfull', signin.createSuccesfull)
router.get('/login', signin.login )
router.post('/login', signin.doLogin)
router.get('/sucessfullLogin',sessionMiddleware.isAuthenticated, signin.sucessfullLogin)
router.post("/logout",  signin.logout);
router.get('/private', signin.private)


module.exports = router;
