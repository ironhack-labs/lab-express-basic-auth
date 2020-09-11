
const express = require('express')
const router = express.Router()

const User = require('../model/user.model')



router.get('/registro',(req,res) => res.render('sign-up'))

