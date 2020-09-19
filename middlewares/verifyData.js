const User = require('../models/User.model');

const verifyData = async (req, res, next) => {
  const { username, password, confirmationPassword } = req.body;
  if (!username || !password || !confirmationPassword) {
    const errors = {
      usernameError: !username ? 'Username is mandatory' : undefined,
      passwordError: !password ? 'Password is mandatory' : undefined,
      confirmationPasswordError: !confirmationPassword ? 'Password confirmation is mandatory' : undefined,
    };

    res.render('signup.hbs', errors);

    return;
  }

  if (password.length < 6) {
    const errors = {
      passwordError: password.length < 6 ? 'Password must contain at least 6 characters' : undefined,
    };

    res.render('signup.hbs', errors);

    return;
  }

  if (!(password === confirmationPassword)) {
    const errors = {
      passwordError: 'Password does not match',
      confirmationPasswordError: 'Password does not match',
    };

    res.render('signup.hbs', errors);

    return;
  }

  const usernameExists = await User.find({ username });

  if (usernameExists.length > 0) {
    const errors = {
      usernameError: usernameExists.length > 0 ? 'Username already exists' : undefined,
    };

    res.render('signup', errors);

    return;
  }

  next();
};

module.exports = verifyData;
