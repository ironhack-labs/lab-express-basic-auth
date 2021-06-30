const router = require('express').Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');

// Handles logout and will destoy angles!

router.get('/logout', (req, res, next) => {
    req.session.destroy()


// // sets global variables for hbs files
    req.app.locals.isLoggedIn = false;

    res.redirect('/')

})



// Handels GET request to signin and show form
router.get ('/signin', (req, res, next) => {
    // const {username, email, password} = req.body
    res.render ('auth/signin.hbs')
})

// Handles GET request to signup form 
router.get ('/signup', (req, res, next) => {
    res.render ('auth/signup.hbs')
})




// Handle POST request to signup and register the user to the DB 
router.post ('/signup', (req, res, next)=>{
    const {username, password} = req.body
        if (!username || !password) {
            res.render('auth/signup.hbs' ,{error: 'Please enter all fields'})
            return;
        }
        


    //   check for strong passwords
      let passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
      if (!passRegEx.test(password)) {
        res.render('auth/signup.hbs', {error: 'Password needs to have a special character a number and be 6-16 characters'})
        // To tell JS to come out off this function
        return;
      }


    // Generates a salt
    const salt = bcrypt.genSaltSync(10);

    // Uses the salt and your password to create a hashed password
    const hash = bcrypt.hashSync(password, salt);

UserModel.create({username, password: hash}) 
    .then(()=> {
        res.redirect('/')
    })
    .catch((err)=>{
        next(err)
    })
    
    
}) 


// Handles POST requests to /signin and allows user to access private pages of the app
router.post('/signin', (req, res, next) => {
    const {username, password} = req.body

    // check if the email is in the DB
          // verify the pass
    
    UserModel.findOne({username})
        .then((user) => {
           if (user) {
              //If the email does exist 
              //bcrypt.compareSync( PASSWORD_FROM_PAGE, PASSWORD_FROM_DB);

              let isValid = bcrypt.compareSync( password, user.password);
              console.log(isValid)
              if (isValid) {

                  // Create a new key/value pair in your req.session object


                  req.session.loggedInUser = user  
                  req.app.locals.isLoggedIn = true; 
                  res.redirect('/profile')
              }  
              else {
                  // If password does not match
                  res.render('auth/signin', {error: 'Invalid password'})
              }  
           } 
           else {
              //If the user does not exist 
             res.render('auth/signin', {error: 'User does not exists'})
           }
        })
        .catch((err) => {
            next(err)
        })      
})


function checkLoggedIn(req,res,next) {
    if (req.session.loggedInUser) {
        next()
      
    }
    else {
        res.redirect('/signin')
    }
}


// Handles GET requests to /profile and shows a cool page
router.get('/profile', checkLoggedIn, (req, res, next) => {
    res.render('auth/profile.hbs', {name: req.session.loggedInUser.username})

})




module.exports = router;
