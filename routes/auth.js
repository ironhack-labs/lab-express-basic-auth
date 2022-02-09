
const router = require("express").Router();
const bcrypt = require ('bcryptjs')
const User = require('../models/User.model.js')

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post('/signup',(req,res,next) =>{
    const {username,password} = req.body
    if (password.lenght > 4){
        res.render('signup', { message: 'Password must be min 4 characters'})
        return
    }

    if (username.length === 0){
        res.render('signup', { message: 'Username is required'})
        return
         
    }

    User.findOne({username: username })

    .then(userFromDB => {
        if (userFromDB !== null){
            res.render('signup', {message: 'Username is already taken'})
        } else{
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)

            User.create({username, password: hash})
            .then(createdUser => {
                console.log(createdUser)
                res.redirect('/login')
            })

            .catch(err => (err))

        }
        
    })
})


router.post('/login', (req,res,next)=>{
    const {username, password } = req.body

    User.findOne({ username: username})
    .then(userFromDB => {
        if( userFromDB === null) {
            res.render('login', {message: 'User Does Not Exist'})
            return
        }
        if (bcrypt.compareSync(password, userFromDB.password)) {
            console.log('User Authenticated')
            req.session.User = userFromDB
            res.redirect('/main')
        }
    })
})


function loginCheck(){
    return (req,res,next) => {
        if (req.session.user){
            next()
        } else {
            res.redirect('/login')
        }
    }
}

router.get('/main', loginCheck(), (req,res,next)=>{
    res.render('main')

})

module.exports = router;
