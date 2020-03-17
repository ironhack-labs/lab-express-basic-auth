const express = require('express');
const router  = express.Router();
const User = require('../models/user')

const bcrypt = require('bcryptjs')
const saltRounds = 10

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


//SIGN-UP

router.get('/sign-up', (req, res, next) => {
 
  res.render('sign-up');
  
});


router.post("/sign-up", async (req, res, next) => {
  
  const {name, lastName, password} = req.body
    if(name === '' || lastName === '' || password ==='') {
     res.render('sign-up', { errorMessage :'Fill the gaps!'
    });
    return;
  }
  
  
  const findUser = await User.findOne({name})
        if (findUser !== null) {
          return res.render("sign-up", {
            errorMessage: "The username already exists!"
          });
  
        }
  
    
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashPass= bcrypt.hashSync(password, salt)
  
  const userName = new User({name, lastName, password:hashPass})


   await userName.save()

   console.log(findUser)
   res.render('sign-up-successfully')
 
  });


////////////////////////////////////////////////

// LOG-IN

router.get('/login', (req, res, next) => {
 
  res.render('login');
  
});


router.post("/login", async (req, res, next) => {
  
  const {name, password} = req.body;

  if(name === '' || password === '') {
    res.render('login', { errorMessage :'Do it correctly idiot!'
   });
   return;
 }


const findUser = await User.findOne({name})
  if(!findUser){
    return res.render('login', {
      errorMessage: 'The username does not exist'
    });

  }
  if(bcrypt.compareSync(password, findUser.password)){
    req.session.currentUser = findUser;
    res.redirect('/user');
  } else{
    res.render('login', { 
      errorMessage : 'Incorrect password'
    })
  }
});

//////////////////////////////////////

//LOG-OUT

router.get("/logout", (req, res, next) => {
req.session.destroy(err => {
console.log(`${err}`)
res.redirect("/login");
});
});



//////////////////////////////////////////////

module.exports = router;