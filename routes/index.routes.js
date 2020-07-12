const express = require('express');
const router = express.Router();
const signin = require('../controllers/signin.controller')
// const sessionMiddleware = require('../middlewares/session.middleware')


/* GET home page */
router.get('/', signin.indexRender);
router.get('/signin', signin.signinRender)
router.post('/signin', signin.createUser)
router.get('/sucessfull', signin.createSuccesfull)
router.get('/login', signin.login )
router.post('/login', signin.doLogin)
router.get('/sucessfullLogin', signin.sucessfullLogin)
router.post("/logout",  signin.logout);


module.exports = router;
