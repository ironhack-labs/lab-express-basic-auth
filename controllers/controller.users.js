const User = require("../models/user.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

module.exports.create = (req, res, next) => {
  res.render("users/create");
};

module.exports.doCreate = (req, res, next) =>{    
  const newUser = new User(req.body);
  
  User.findOne({username:newUser.username}) 
  .then(user=>{    
    if (user) {     
      res.render('users/create', {user:newUser, errors: {email:`User exists, log in instead`}});
      console.log('user exists');
    } else{            
      newUser.save() // !!! Antes de este save paso por el pre save del model para encriptarlo!!!
      .then((user)=>{ 
        console.log('user created'); 
        res.redirect('/sessions/create'); // ira al middleware y debera logearse primero
      }) 
      .catch(error =>{ 
        if (error instanceof mongoose.Error.ValidationError) {                    
          res.render('users/create', {user:newUser, errors: error.errors});
        } else{          
          next(error);
        }
      });      
    }
  })
  .catch(error =>{ 
    if (error instanceof mongoose.Error.CastError) {      
      next(createError(404, `cast error`));
    } else{      
      next(error);
    }
  });
};

