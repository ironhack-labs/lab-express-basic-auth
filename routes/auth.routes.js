const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');
const router = express();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userPassword,
    userBirthDate,
    userGender,
  } = req.body;

  //   Checking if all required fields were filled out

  const validationErrors = {};

  if (userFirstName.trim().length === 0) {
    validationErrors.userFirstNameError = 'This field is a required field.';
  }

  if (userEmail.trim().length === 0) {
    validationErrors.userEmailError = 'This is a required field.';
  }

  if (userPassword.trim().length === 0) {
    validationErrors.userPasswordError = 'This is a required field.';
  }

  if (Object.keys(validationErrors).length > 0) {
    return res.render('signup', { validationErrors });
  }

  // Verificar se o email já está cadastrado na base de dados
  try {
    const userFromDb = await User.findOne({ username: userEmail });
    if (userFromDb) {
      return res.render('signup', {
        userEmailError: 'This email is already in use.',
      });
    }

    // Encriptar a senha recebida do usuário
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(userPassword, salt);

    // Salvar o usuário na base de dados

    await User.create({
      firstName: userFirstName,
      lastName: userLastName,
      username: userEmail,
      password: encryptedPassword,
      birthDate: new Date(userBirthDate),
      gender: userGender,
    });

    res.redirect('/login');
  } catch (error) {
    console.log('Error in /signup route ===> ', error);
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const userFromDb = await User.findOne({ username: userEmail });

    if (!userFromDb || !bcrypt.compareSync(userPassword, userFromDb.password)) {
      return res.render('login', {
        validationError: 'Email and password combination is invalid.',
      });
    }

    req.session.currentUser = userFromDb;
    return res.redirect('/');
  } catch (error) {
    console.log('Error in /login route ===> ', error);
  }
});

module.exports = router;
