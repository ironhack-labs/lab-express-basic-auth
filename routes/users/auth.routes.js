const { Router } = require('express');
const router = new Router();
const User = require('../../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../../middleware/routes-guard');

/* GET home page */
router.get('/login', isLoggedOut, async (req, res, next) => {
  res.render('auth/login');
});

router.get('/register', async (req, res, next) => {
  req.query.R === 'T' ? (isRegistered = true) : (isRegistered = false);
  res.render('auth/register', { isRegistered });
});

router.get('/logout', async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});

router.post('/login', async (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  try {
    const errorMsg = [];
    const { username, password } = req.body;

    if (!username) errorMsg.push('Validation Error: username cannot be empty!');
    if (!password) errorMsg.push('Validation Error: password cannot be empty!');

    if (errorMsg.length) throw new Error(errorMsg);

    const user = await User.findOne({ username });
    if (!user) throw new Error('Username not found');

    console.log({ user });

    const pwdOk = await bcryptjs.compare(password, user.password);

    if (!pwdOk) throw new Error('Password is invalid');

    req.session.currentUser = user;
    res.redirect('/user/main');
  } catch (err) {
    console.log({ error: err });

    res.status(500).render('auth/login', { errorMsg: err.message.split(',') });
  }
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
