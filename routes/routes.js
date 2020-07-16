const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

router.get('/login', users.controller.login)