const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



module.exports = router;



// We have to create the signup of the application, that allow our users to register. 
// The users have to provide the following information:

// Username: Must be unique in our application, and will identify each user.
// Password: Must be encrypted, using bcrypt.
// To complete this first iteration, you have to create the database model with mongoose, the routes, and the views.

// Remember that you have to handle validation errors when a user signs up:

// The fields can't be empty.
// The username can't be repeated.