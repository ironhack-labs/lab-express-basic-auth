const router = require("express").Router()
const User = require("../models/User.model")

const isLoggedIn = require("../middlewares/login")


const bcrypt = require('bcryptjs')
const saltRounds = 10 

router.get('/sign-up', (req, res)=>{
    
    res.render('auth/sign-up')
    
})

router.post('/sign-up', async(req, res, next)=>{
    try {
        const {username, password} = req.body 
        
        if(!username || !password){
            res.render('auth/sign-up', {errorMessage: "Please, fill in all fields."})
            return
        }

        const takenUsername = await User.findOne({username : username})
        if(takenUsername){
            res.render('auth/sign-up', {errorMessage:"Username is already taken."})
            return
        }
        
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        await User.create({ username, password:hashedPassword });
        res.redirect("/");

    } catch (error) {
        next(error)
    }
})

router.get('/login', (req, res, next)=>{
    try {
        res.render('auth/login')

    } catch (error) {
        next(error)
    }
})

router.post('/login', async(req, res, next)=>{
    try {
        const {username, password} = req.body
        if(!username || !password){
            res.render('auth/login', {errorMessage: 'Please, fill in all fields'})
            return
        }

        const user = await User.findOne({username})
        if(!user){
            res.render('auth/login', {errorMessage: 'Incorrect username or password'})
            return
        }
        if(!bcrypt.compareSync(password, user.password)){
            res.render('auth/login', {errorMessage: 'Incorrect username or password'})
            return
        }
        req.session.currentUser = user;
        console.log(req.session)
        
        res.redirect('/auth/main')        

    } catch (error) {
        next(error)
    }
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
})


router.get('/main', isLoggedIn, (req, res)=>{
    res.render('private/main')
})

router.get('/private', isLoggedIn, (req, res)=>{
    res.render('private/private')
})

module.exports = router