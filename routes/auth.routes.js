const { Router } = require('express');
const router = new Router();

router.get('/signup', (req, res) => res.render('auth/signup'));

 
router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
  });   

router.get("/login", (req, res) => res.render("auth/login"));

 
// POST login route ==> to process form data
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
 
  User.findOne({ email }) 
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.'
        });
        return;
      }
      else if (bcryptjs.compareSync(password, user.passwordHash)) {
        res.render('users/user-profile', { user });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

module.exports = router;