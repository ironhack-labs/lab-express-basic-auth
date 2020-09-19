const User = require('../models/User.model');
const { verifyPassword } = require('../utils/passwordManager');

const verifyLoginData = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const errors = {
      usernameError: !username ? 'Username required' : undefined,
      passwordError: !password ? 'Password required' : undefined,
    };

    res.render('login', errors);

    return;
  }

  if (password.length < 6) {
    const errors = {
      passwordError: password.length < 6 ? 'Password must contain at least 6 characters' : undefined,
    };

    res.render('login', errors);

    return;
  }

  const userExists = await User.findOne({ username });

  if (!userExists) {
    res.render('login', { errorMessage: 'Incorrect username or password, please try again' });

    return;
  }

  const isPasswordMatch = verifyPassword(password, userExists.password);

  if (!isPasswordMatch) {
    res.render('login', { errorMessage: 'Incorrect username or password, please try again' });

    return;
  }
  req.userAuthenticated = userExists;
  next();
};

module.exports = verifyLoginData;
