const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//AUTHENTICATION ROUTES
/* router.post('/', (req, res, next) => {
  console.log('The form data: ', req.body);
}); */

/* router.post('/', (req, res, next) => {
  const { username, password } = req.body;

bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
      })
  .then(userFromDB => {
        // console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile')
      })
  .catch(error => next(error));                   
}); */



  /* if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both username and passowrd to login.'
    });
    return;
  }

  User.findOne({username})
    .then(username => {
      if (!username) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, username.passwordHash)) {
        res.render('users/user-profile', {username});
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
}); */



router.get('/signup', (req, res) => res.render('auth/signup'));

/* router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
 
  // everything else stays untouched
});

router.get('/userProfile', (req, res) => res.render('users/user-profile')); */


module.exports = router;
