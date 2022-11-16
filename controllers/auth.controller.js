
const bcryptjs = require('bcryptjs')

const User = require('../models/User.model');

  const signupGetController = (req, res, nex) => {
    res.render('signup.hbs');
  };
  
  const signupPostController = (req, res, nex) => {
    console.log(req.body);
  
    if (!req.body.username || !req.body.password) {
        res.send('cant have empty fields');
        return;
    }
  
  User.findOne({username: req.body.username}) 
  .then(foundUser => {
    if(foundUser) {
      res.send('sorry user already exists')
      return;
    }
  
    const myHashedPassword = bcryptjs.hashSync(req.body.password)
    
    return User.create({
        username: req.body.username,
        password: myHashedPassword
    })
  })
    .then((newUser) => {
        console.log('new user created', newUser);
        res.send(newUser);
        res.render('signup.hbs')
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
  };
  
  
  const loginGetController = (req, res, nex) => {
    res.render('login.hbs')
  };
  
  const loginPostController = (req, res, nex) => {
  
    console.log(req.body)
    
        if(!req.body.username || ! req.body.password) {
            res.render('login.hbs', { errorMessage: 'Sorry you forgot email or password.'});
            return;
        }
    
        User.findOne({username: req.body.username})
        .then( foundUser => {
    
            if(!foundUser) {
                res.render('login.hbs', { errorMessage: 'Sorry user does not exist!'})
                return;
             }
             const isValidPassword = bcryptjs.compareSync(req.body.password, foundUser.password)
    
             if(!isValidPassword) {
                res.render('login.hbs', { errorMessage: 'Sorry wrong password'} );
                return;
             }
            
            req.session.user = foundUser;
            
            res.redirect('/profile');
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
    };
  
    const profileGetController = (req, res, nex) => {
      res.render('profile.hbs', req.session.user);
    };
    
    const mainGetController = (req, res, nex) => {
      res.render('main.hbs')
    };
  
    const privateGetController = (req, res, nex) => {
      res.render('private.hbs')
    };

    const logoutGetController = (req, res, nex) => {
      req.session.destroy(() => {
        res.redirect('/');
      })
    }
  

    module.exports = { signupGetController,
        signupPostController, loginGetController, loginPostController,
         profileGetController, mainGetController, privateGetController, logoutGetController
      }