const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User.model')

router.get('/signup', (req, res) =>{
    res.render('signup')
})

router.post('/signup', async (req, res) =>{
    const { username, password } = req.body
    
    const validationErrors = {};

    if(username.trim().length === 0){
        validationErrors.usernameError = 'Campo obrigatório'
    }

    if(password.trim().length === 0){
        validationErrors.passwordError = 'Campo obrigatório'
    }

    if (Object.keys(validationErrors).length > 0) {
        return res.render('signup', validationErrors);
    }

    try {
        const userFromDb = await User.findOne({ username: username });

        if(userFromDb){
            return res.render('signup', { usernameError: 'esse nome de usuário já foi escolhido :(' })
        }
        
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds)
        const encryptedPassword = bcrypt.hashSync(password, salt);
        console.log(req.body)
        const newUser = new User({
            username: username,
            password: encryptedPassword
        })
        console.log(newUser)

        await newUser.save()

        res.redirect('/login')

    } catch (error) {
        console.log(error)
    }
})

router.get('/login', (req, res) =>{
    res.render('login')
})

router.post('/login', async (req, res) =>{
    const { username, password } = req.body

    try {
        const usernameFromDb = await User.findOne( { username: username })
        if(!usernameFromDb){
            return res.render('login', {usernameError: 'usuário ou senha não cadastrado'})
        }
        const isPasswordValid = bcrypt.compareSync( password, usernameFromDb.password )
        if(!isPasswordValid){
            return res.render('login', {usernameError: 'usuário ou senha não cadastrado'})
        }

        req.session.currentUser = usernameFromDb
        
        res.redirect('/main')

    } catch (error) {
        console.log(error)
    }
})

router.get('/logout', (req,res) =>{
    req.session.destroy();
    res.redirect('/login')
})

module.exports = router;