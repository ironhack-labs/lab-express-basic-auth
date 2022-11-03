const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', (req, res) => res.render('auth/signup'));


router.post('/signup', async (req, res, next) => {
    const { username, email} = req.body;
  