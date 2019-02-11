let router = require('express').Router()
let User = require('../models/user')
let bcrypt = require('bcrypt')


/*
router.use((req, res, next) => {
    if (req.session.currentUser) {
        res.render('private')
    } else {
        res.redirect("/");
    }
});
*/








function isAuth (req,res,next){
    if(req.session.currentUser){
        res.redirect('/')
    } else{
        next()
    }
}


router.post('/login', (req,res,next)=>{
    let {username, password} = req.body //deconstruir body
    User.findOne({username})
        .then(user=>{
            if(!user) return res.render('auth/login',{error: "Tu ni existes"})
            if(bcrypt.compareSync(password, user.password)){
                req.session.currentUser = user;
                res.redirect('/')
                return
            }
            res.render('auth/login',{error: "Tu contraseña esta mal"})
        })
        .catch(e=>next(e))

})

router.get('/login',isAuth, (req,res,next)=>{
    res.render('auth/login')
})



router.post('/signup',(req,res,next)=>{
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(req.body.password,salt)
    req.body.password = hash
    User.create(req.body)
        .then(()=>res.redirect('/login'))
        .catch(e=> (e))

})


router.get('/signup', (req,res,next)=>{
    res.render('auth/signup')
})


module.exports = router