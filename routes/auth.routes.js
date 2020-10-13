const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const UserModel = require('../models/User.model')

//=====SIGN UP=====//
router.get('/signup', (req, res) =>{
    res.render('auth/signup.hbs')
})

router.post('/signup', (req, res) => {
    const {username, password}=req.body
    
    if(!username || !password){
        res.status(500).render('auth/signup.hbs', {message: 'Please enter all details'})
        return;
      }
    

    UserModel.findOne({username})
    .then((data)=> {
        if(!data){
            bcrypt.genSalt(10)  //no. of rounds
  
            .then((salt) => {
              //console.log(salt)
        
              bcrypt.hash(password, salt)
              .then((hashedPassword)=> {
               // console.log('pass is', hashedPassword )
                  UserModel.create({  //dont use req.body!
                  username: username, 
                  password: hashedPassword
                })
                .then(() =>{
                    res.redirect('/')
                })
            })
              
          })
        }else{
            res.status(500).render('auth/signup.hbs', {message:'Username already exists, please choose a different username'})
            return;
        }
    })

})

//=====SIGN IN======//

router.get('/signin', (req,res) =>{
    res.render('auth/signin.hbs')
})

router.post('/signin', (req,res) =>{
    const {username, password} = req.body
    if(!username || !password){
        res.status(500).render('auth/signin.hbs', {message: 'Please enter all details'})
        return;
      }
  
  UserModel.findOne({username:username})
  .then((userData) => {
    if(!userData){ 
      res.status(500).render('auth/signin.hbs', {message:'User does not exist'})
      return;
    }
    bcrypt.compare(password,userData.password)
    .then((result) => {
      //check if result is true
      if(result){
        userName=userData.name
        req.session.loggedInUser =userData //creates a session on log in, middleware saves in mongodb
        res.redirect('/') //redirect to profile page etc
      }//else error message
      else {
        res.status(500).render('auth/signin.hbs', {message: 'Password does not match'})
      }
    })
    .catch(()=> {
      res.status(500).render('auth/signin.hbs', {message: 'Something went wrong, please try again'})//for bcrypt failure/findone/ etc
    })
  })
})



module.exports = router;