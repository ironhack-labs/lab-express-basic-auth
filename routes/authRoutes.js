const express = require('express');
const User = require('../models/User');
const generateEncryptedPassword = require('../utils/passwordManager');


const router = express.Router();

router.get('/signup', (req, res) =>{
    res.render('auth-views/signup');
});

const verifyData = async (req, res) => {

    const {username, password} = req.body;

    if (!username ||  !password ){
        const errors = {
            usernameError: !username ? "Campo nome de usuário obrigatorio" : undefined,
            passwordError: !password ? "Campo password obrigatorio" : undefined,
        };

        res.render('auth-views/signup', errors);

        return false;
    }
    if (password.length < 6){
        const errors = {
            passwordError: "sua senha deve ter no mínimo 6 digitos!",
        };
        res.render('auth-views/signup', errors);
        return false;
    }

    // const userCpfExists = await User.find({ cpf });
    // const userEmailExists = await User.find({ email });
    // if (userEmailExists.length > 0 || userCpfExists.length > 0) {
    //     const errors = {
    //       emailError: userEmailExists.length > 0 ? 'Email já cadastrado' : undefined,
    //       cpfError: userCpfExists.length > 0 ? 'CPF já cadastrado' : undefined,
    //     };
    
    //     res.render('auth-views/signup', errors);
    //   }      
    
    const userExists = await User.find({username});
    
    console.log(userExists);
    
    if (userExists.length > 0){
        res.render('auth-views/signup', {errorMessage: "Nome de usuário já cadastrado."});
        return false;
    }

    return true;
};

router.post('/signup', async (req, res) =>{
try {
    const {username, email, cpf, password} = req.body;
    const isDataValid = await verifyData(req, res);

    //console.log(isDataValid);

    if (!isDataValid) {
        return;
    };

    const newUser = new User({
      username,
      email,
      cpf,
      password: await generateEncryptedPassword(password),
    });
    console.log(newUser);

    await newUser.save();
    res.redirect('/signup');

} catch (error) {
    console.log(error);
}
});


module.exports = router;
