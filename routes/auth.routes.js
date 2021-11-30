const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');
const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard')

const bcryptjs = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');
const saltRounds = 10;

 

/*GET SIGNUP*/
router.get("/signup", (req, res, next) => {
  const {err} = req.query
  res.render("signup",{err});
});

/*GET LOGIN*/
router.get("/login", (req, res, next) => {
  res.render("login");
});



/*EMAIL/USER FORMAT CONDITIONS*/
const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

/*TYPES OF ERRORS*/

//ERROR 1: SEES IF THE ERROR OBJECT IS COMING FROM MONNGOOSE
function mongooseError (error) {
  return error instanceof mongoose.Error.ValidationError;

}

//ERROR 2 : MONGO ERROR

function mongoError (error) {
  return error.code === 11000;

}


/*POST SIGNUP*/


router.post('/signup', isLoggedOut, (req, res, next) => {
  try {

    //ACESS TO INFO GIVEN BY THE CLIENTE
    const { email , password}= req.body
    
    //COND1: MISSING CREDENTIALS
    if( !email|| !password) {
      return res.redirect("/signup?err=Missing Credentials")
    }

    //COND2: HAS WRONG FORMAT
    if( !emailRegex.test(email)|| !passwordRegex.test(password)) {
      return res.redirect("/signup?err=Wrong format")
    }

    //HASH THE PASSWORD
    const saltRounds =10;
    const salt= await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password,salt)

    //CREATE NEW USER WITH HASHED PASSWORD
    const newUser = await User.create({email:email, password: hashedPassword }).lean()

    //ALL DONE => REDIRECT TO PRIVATE PAGE
    req.session.currentUser = newUser;
    return res.redirect("/private")
   

  } catch(err) {
    
    //ERROR 1
    if(mongooseError(err)) {
      return res.redirect("/signup?err=Validation Error")
    }

    //ERROR 2
    if(mongoError(err)) {
      return res.redirect("/signup?err=Email in Use")
    }

    //OTHER ERRORS
    console.error(err);
    return res.redirect("/signup?err=something went wrong");
  }
})

/*POST LOGIN => THE USER IS ALREADY CREATED */


router.post('/login', isLoggedOut, (req, res, next) => {
  try {

     //ACESS TO INFO GIVEN BY THE CLIENTE
     const { email , password}= req.body
    
     //COND1: MISSING CREDENTIALS
     if( !email|| !password) {
       return res.redirect("/login?err=Missing Credentials")
     }

     //COND2: HAS WRONG FORMAT
     if( !emailRegex.test(email)|| !passwordRegex.test(password)) {
       return res.redirect("/login?err=Wrong format")
      } 

    //VERIFICATION 1: SEARCH THE EMAIL (EMAIL IS UNIQUE)
    const user = await User.findOne({email}).lean()

    // USER NOT FOUND 
    if(!user) {
      return res.redirect("/login?err=User not found")
    }

    //VERIFICATION 2: COMPARE THE PASSWORD RECIEVED AND THE PASSWORD FROM THE DATABASE
    const verification2 = await bcrypt.compare(password, user.password)

    // VERIFICATION 1 & 2 COMPLETED =>  REDIRECT TO PRIVATE PAGE
    if(verification2) {
      return res.redirect("/private")
    }

    }

  catch(err) {
    
    //ERROR 1
    if(mongooseError(err)) {
      return res.redirect("/signup?err=Validation Error")
    }

    //ERROR 2

    if(mongoError(err)) {
      return res.redirect("/signup?err=mongoError")
    }

    //OTHER ERRORS
    console.error(err);
    return res.redirect("/signup?err=something went wrong");
  }
})


/*POST LOGOUT */

router.post('/logout', isLoggedIn, async(req,res,next) => {
  try{
    await req.session.destroy();
    return res.redirect("/");
  } catch (err) {
    console.log(err)
  }
})


module.exports = router;


function isValidSubsequence(array, sequence) {
  for(let number of array) {
		return sequence.includes(number)
		}
		}
