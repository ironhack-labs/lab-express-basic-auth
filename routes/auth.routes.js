const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')

router.get('/signup', (req, res) => res.render('auth/signup'));



router.post('/signup', async (req, res, next) => {
    
    try {
        const { username, email, password } = req.body;
        console.log(req.body)
        const saltRounds = 10;

        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const { password: x, ...user }= await User.create({username, email ,passwordHash: hashedPassword});
        console.log('new user', user)
        req.session.currentUser = user;
        // req.session.currentUser = newUser;
        return res.render('users/user-profile' ,{user});
    } catch (err) {
        console.error(err)
        res.redirect(`/signup?err=something went wrong`)} {
        
    }

})

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile')
})

router.get('/login', (req, res) => {

    res.render('auth/login')
})

router.post('/login', async (req, res) => {
    try{

        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
        return res.redirect(`/login?err=email is not registered`)
        }
        const isValidUser = await bcryptjs.compare(password, user.passwordHash);
        if(isValidUser){
            const { password, ...currentUser} = user;
            req.session.currentUser = currentUser;
         return res.render('users/user-profile', {user})
        }
    } catch(err){
        res.redirect(`/login?err=something went wrong`)
    }
})

router.post('/logout', async (req, res) => {
try{
  await req.session.destroy()
    res.redirect('/')
}
catch (err){
    console.error(err)
}
})


module.exports = router;