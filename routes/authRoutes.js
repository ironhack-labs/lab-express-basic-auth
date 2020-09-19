const express = require('express');
const User = require('../models/User');
const  {generateEncryptedPassword, verifyPassword} = require('../utils/passwordManager');


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
    
    //console.log(userExists);
    
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
    res.redirect('/login');

} catch (error) {
    console.log(error);
}
});

router.get('/login',  (req, res) =>{

    const {sessionExpired} = req.query;
    //console.log(sessionExpired);

    res.render('auth-views/login', {sessionExpired});

})

const verifyLoginData = async (req, res) =>{
    const {username, password} = req.body;

    if ( !username  || !password ){
        const errors = {
            usernameError: !username ? "Campo Usuário obrigatorio" : undefined,
            passwordError: !password ? "Campo password obrigatorio" : undefined,
        };

        res.render('auth-views/login', errors);

        return false;
    }

    if (password.length < 6){
        const errors = {
            passwordError: "sua senha deve ter no mínimo 6 digitos!",
        };
        res.render('auth-views/login', errors);
        return false;
    }

    const userExists = await User.findOne({ username });

    //console.log(userExists);

    if (!userExists) {
        res.render('auth-views/login', {errorMessage: 'Usuário os senha incorretos. Tente novamente!'});

        return false;
    }
    const passwordOk = await verifyPassword(password, userExists.password);

    if (!passwordOk){
        res.render('auth-views/login', {errorMessage: 'Usuário os senha incorretos. Tente novamente!'});

        return false;
    }
    
    return userExists;

};

router.post('/login',  async (req, res) =>{
    try{
        const userOK = await verifyLoginData(req, res);
        
        if (!userOK){
            return ;
        }

        console.log(userOK);

        const userCopy = JSON.parse(JSON.stringify(userOK));

        delete userCopy.pasword;

        req.session.currentUser = userCopy;

        res.redirect('main');
    } catch(error){
        console.log(error)
    }
});

router.get('/logout', (req, res) =>{
    req.session.destroy();
    res.redirect('/login');
});


module.exports = router;
