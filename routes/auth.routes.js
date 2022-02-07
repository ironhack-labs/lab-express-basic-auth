const router = require("express").Router();
const bcryptjs = require ('bcryptjs')

const User = require ('./../models/User.model')
const saltRounds = 10

//sing up

//1.1 Render

router.get("/register", (req, res, next) => {
  res.render("auth/sing-up");
});

//1.2 Handle

router.post('/register', (req, res, next)=>{

  const {username, password} = req.body

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User
        .create({username,password:hashedPassword})
    })
    .then(createdUser => res.redirect('/'))
    .catch(error => next(error))
})


// login

//2.1 Render

router.get('/login',(req, res, next) => {
   res.render('auth/login')
})

//2.2 Handle

router.post ('/login', (req, res, next)=> {

  const {username, password} = req.body

  if (username.lenght === 0 || password.lenght === 0) {
    res.render ('auth/login', {errorMessage: '*Rellena todos los campos' })
    return
  }

  User
    .findOne({username})
    .then(user=>{
      if (!user) {
        res.render('auth/login',{ errorMessage:'No esperes a registrate!'})
        return
      } else if (bcryptjs.compareSync(password, user.password)=== false){
        return
      } else{
        req.session.currentUser = user
        res.redirect ('/perfil')
      }

    })

})



module.exports = router;
