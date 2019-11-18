const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')

const bcryptSalt=10

const User =require('../models/User.model')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
  
router.get('/signup',(req,res)=> res.render('auth/signup'))
router.post('/signup',(req,res)=>{



const{username,password}= req.body

if (!username || !password) {
res.render('auth/signup', {errorMessage : 'Tienes que rellenar campos' })
return
}

User.findOne({'username':username})
.then(user => {
if (user) {
  res.render('auth/signup', {errorMessage: 'Nombre existente, cambialo'})
  return
}

})

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password,salt)

    User.create({username,password:hashPass})
    res.redirect('/')


})

router.get('/login', (req, res) => res.render('auth/login'))
 router.post('/login', (req,res) => {
const {
  username,
  password
} = req.body
if (!username || !password) {
  res.render('auth/login', {
    errorMessage: 'Tienes que rellenar campos'
  })
  return
}

User.findOne({'username' : username})
.then(user => {
  if(!user) {
    res.render('auth/login', {errorMessage: 'Usuario no existe'})
  return
    
  }
if (bcrypt.compareSync(password, user.password)){
req.session.currentUser = user
res.redirect('/')

} else {
  res.render('auth/login', {
    errorMessage: 'Contrasena incorecta'
  })
  
}

})
.catch(error => console.log('error', error))

 })




router.use((req,res,next) =>{
  console.log(req.session)
  req.session.currentUser?next():res.redirect("/login")
})

router.get("/private",(req,res)=>{
  res.render("private-page",{user:req.session.currentUser})
})









module.exports = router;

