const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')


router.get('/signup', (req, res, next) => {
	res.render('signup')
});



router.post('/signup', (req, res, next)=> {
    const { username, password } = req.body 
    console.log(username, password)

    if(password.length < 4) {
        res.render('signup', {message : "Password has to be 4  chars min"})
    }
    if(username === '') {
        res.render('signup', {message: 'Username cannot be empty'})
    }

    User.findOne({username: username}) 
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render('signup', { message: 'Your username is already taken' })
            } else {
                const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
				console.log(hash)


                User.create({ username: username, password: hash })
					.then(createdUser => {
						console.log(createdUser)
                        //auth rausgenommen da in App.js schon vorgegeben 
						res.render('login')
					})
                    .catch(err => {
						next(err)
					})
            }
        })
})



router.get('/login', (req, res, next) => {
    res.render('login')
   
})


router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    User.findOne({username: username}) 
    .then(userFromDB => {

        if(userFromDB === null) {
            res.render('login', {message: 'Wrong credentials'})
            return
        }

        // wie kommen wir hier auf password, userFromDB.password 

        if(bcrypt.compareSync(password, userFromDB.password)) {
            // wieso session? 
                req.session.user = userFromDB
				res.redirect('/auth/privat')
            } else {
				res.render('login', { message: 'Wrong credentials' })
				return
			}
    })

})

function loginCheck() {
    return (req, res, next) => {
      if (req.session.user !== undefined) {
        next()
      } else {
        res.redirect('/auth/login')
      }
    }
  }

router.get('/privat', loginCheck(), (req, res, next) => {
    const username = req.session.user.username
    res.render('privat', { username: username })
  });




  
module.exports = router; 