const router = require('express').Router()
const {profileView} = require('../controllers/authControllers')
const {islogged} = require('../middlewares')


router.get('/profileUser',profileView, islogged)

module.exports = router

