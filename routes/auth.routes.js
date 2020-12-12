const express = require('express');
const router = express.Router();
const { register, createUser, loginUser, logout, private, auth } = require('../controllers/index')

router.get('/register', register)
router.post('/signup', createUser)
router.post('/login', loginUser)
router.get('/main')
router.post('/logout', logout)
router.get('/logout', logout)
router.get('/private', auth, private)

module.exports = router;