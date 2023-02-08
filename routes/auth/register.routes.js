const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../../models/User.model');

const mongoose = require('mongoose');
const { bulkSave } = require('../../models/User.model');

/* GET home page */
router.get('/register', async (req, res, next) => {
  req.query.R === 'T' ? (isRegistered = true) : (isRegistered = false);
  res.render('auth/register', { isRegistered });
});

router.post('/register', async (req, res, next) => {
  try {
    console.log({ body: req.body });
    let errorMsg = [];
    if (!req.body.username)
      errorMsg.push('Validation Error: username cannot be empty');
    if (!req.body.password)
      errorMsg.push('Validation Error: password cannot be empty');
    if (req.body.password !== req.body.password2)
      errorMsg.push('Validation Error: password do not match');
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(req.body.password))
      errorMsg.push(
        'Password most be at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'
      );
    if (errorMsg.length) throw new Error(errorMsg);

    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    console.log({ salt, hashedPassword });

    let data = await User.create({ ...req.body, password: hashedPassword });

    console.log({ data });
    res.redirect('/user/register?R=T');
  } catch (err) {
    console.log({ error: err });
    res.status(500).render('auth/register', {
      ...req.body,
      errorMsg: err.message.split(','),
    });

    // if (err instanceof mongoose.Error.ValidationError) {
    // }

    // next(err);
  }
});

module.exports = router;
