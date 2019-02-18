const express = require('express');
const router  = express.Router();
const User = require('../models/userDB')   // User model
// const Img = require('../models/upLondImg')
const uploadCloud = require('../config/cloudinary')

const bcrypt = require('bcrypt');
const bcryptSalt = 5;



/* Homepage*/ 
router.get('/',(req,res,next)=>{
  res.render('home')
})



/* GET login.hbs*/
router.get('/login', (req, res, next) => {
  res.render('login');
});

/* GET signup.hbs*/
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/imagesPage', (req, res, next) => {
  res.render('imagesPage');
});





// BCrypt to encrypt passwords
router.post('/FromLogin',(req,res,next) =>{

  const username = req.body.username; 
  const password = req.body.password;
  

if (username === "" ){
  res.render('login',{
    ErrUsername: 'please inseart the  username'
  })
}else if(password === ""){
  res.render('login',{
    ErrPassword: 'plaese insert the password'    
  })
  return
}

User.findOne({'username':username}).then(user =>{

  if(!user){

    res.render('login',{
      errLogin: 'The username doesn\'t exist. '
    });
    return
  }
    // Save the login in the session!
   if(bcrypt.compareSync(password, user.password)){
    // Save the login in the session!
    console.log('workkkkkkkkk')
    req.session.currentUser =user;
    res.redirect('/yourLoginFine')
    
    .catch(error => {
      console.log('Someting Wronge...........',error)
    })
   }else{

    res.render('login',{
      errLogin: 'Incorrect password'
    })
   }
  })
.catch(error => {
  next(error);
})


});



router.post('/addImg', uploadCloud.single('Photo'),(req,res,next)=>{
  console.log('Someting Wronge...........')
    const {title, description} = req.body;
    const imgPath = req.file.url;
    const imgName = req.file.originalname;
    const newAddImg = new UserSchema ({title, description, imgPath, imgName})
    newAddImg.save()
    .then(images => {
      res.redirect('/')

    })
    .catch(error => {
      console.log(error);
    })
})











///............................................................................................
router.post('/FromSignup',(req,res,next) =>{

  const username = req.body.username; 
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  console.log('in here!', username, password)
  

if (username === "" ){
  res.render('signup',{
    ErrUsername: 'please inseart the  username'
  })
}else if(password === ""){
  res.render('signup',{
    ErrPassword: 'plaese insert the password'    
  })
  return
}
User.findOne({'username': username}).then (user =>{
  console.log('work.....................................')
  if (user !== null){
      res.render('signup',{
        ErrMessage: 'This username have someone alredy use'
      })
      return
  }


  User.create({
    username,
    password:hashPass
  }).then (()=>{
    res.redirect('/')
  }).catch ((err) =>{
    console.log(err,'..................................')
  })
  .catch((error)=>{
    next(error)
  })

})


});





module.exports = router;
