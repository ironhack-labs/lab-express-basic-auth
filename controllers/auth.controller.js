const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const getSignup = (req, res) => {
    res.render('auth/signup')
}

const postSignup = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if(!username) {
            return res.render('auth/signup', { errorMessage: 'The username fiel is required' });
        }
        if(!password){
            return res.render('auth/signup', {errorMessage: 'The password fiel is required' });
        }
        const foundUserName = await User.findOne( {username} )
        if(foundUserName){
            return res.render('auth/signup', {errorMessage: 'The username already exist' });
        }
        const salt = bcrypt.genSaltSync(12);
        const encryptedPassword = bcrypt.hashSync(password, salt);
        const userCreate = await User.create( {username, password: encryptedPassword} )
        console.log('La ruta es correcta');
        res.redirect('/login')
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
        } else {
            next(error);
        }
        
    }
}

const getLogin = (req, res) =>{
    res.render('auth/login')
}

const postLogin = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if(!username) {
            return res.render('auth/login', { errorMessage: 'The username fiel is required' });
        }
        if(!password){
            return res.render('auth/login', {errorMessage: 'The password fiel is required' });
        }

        const userExist = await User.findOne( {username} );

        if(!userExist){
            return res.render('auth/login', {errorMessage: 'The username or password are incorrect' } );
        }

        const match = bcrypt.compareSync(password, userExist.password);

        if(match){
            const loggedUser = userExist.toObject();
            delete loggedUser.password;
            // guardamos el user en el req.session
            req.session.currentUser = loggedUser;
            return res.redirect('/profile')

        }
        res.render('auth/login', {errorMessage: 'The username or password are incorrect' } );

        
    } catch (error) {
        
    }

}

const getProfile = (req, res) => {
    try {
        const { username, } = req.session.currentUser;
        res.render('user/profile', { username })
    } catch (error) {
        next(error)
    }

}

const getLogout = (req, res, next) => {
    req.session.destroy((error) => {
        if(error){
            return next(error)
        }
        res.redirect('/')
    })
}


const getMain = (req, res, next) => {
    res.render('auth/main');
}

const getPrivate = (req, res, next) => {
    res.render('auth/private');
}
module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    getProfile,
    getLogout,
    getMain,
    getPrivate
}