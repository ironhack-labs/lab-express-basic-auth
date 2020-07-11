const express = require('express');
const router = express.Router();
const signin = require('../controllers/signin.controller')


/* GET home page */
router.get('/', signin.indexRender);
router.get('/signin', signin.signinRender)
router.post('/signin', signin.createUser)
router.get('/sucessfull', signin.createSuccesfull)

module.exports = router;
