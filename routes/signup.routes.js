const express = require('express');
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

const validationErrors = {
    userFirstNameError = '',
    userEmailError = '',
    userPasswordError = ''
}

if (userFirstName.length === 0) {
    validationErrors.userFirstNameError = 'Campo obrigatório';
}

if (userEmail.length === 0) {
    validationErrors.userEmailError = 'Campo obrigatório';
}

if (userPassword.length === 0) {
    validationErrors.userPasswordError = 'Campo obrigatório';
}

if (Object.keys(validationErrors).length > 0) {
    res.render('signup', { validationErrors });
    return;
}

// Verificar se o email já está cadastrado na base de dados
try {
    const userFromDb = await User.find({username: userEmail});
    if (userFromDb) {
        res.render('signup', {userEmailError: 'This email is already in use.'});
        return;
    }

    // Encriptar a senha recebida do usuário
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hasSync(userPassword, salt);

    // Salvar o usuário na base de dados

    await User.create( { firstName: userFirstName, lastName: userLastName, username: userEmail, password: encryptedPassword, birthDate: new Date(userBirthDate), gender: userGender });

    res.redirect('/login');

} catch(error) {
    console.log('Erro na rota /signup ===> ', error);

}

});

module.exports = router;
