const router = require("express").Router();
const UserModel = require("../models/User.model");
var bcrypt = require("bcryptjs");


router.get('/logout', (req,res,nex)=>{

  req.session.destroy()

  req.app.locals.isLoggedIn = false;
  res.redirect('/')
})


router.get("/signup", (req, res, next) => {
    res.render("signinout/signup.hbs");
  });

  
    
  router.post("/signup", (req, res, next) => {
    let { username , password } = req.body

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    UserModel.create({username,password: hash})
    .then(()=>{
      res.redirect("/")
    })
    .catch((err)=>{
      next()
    })
  })

  router.get("/login", (req, res, next) => {
    res.render("signinout/login.hbs");
  });



  router.post("/login",(req,res,next)=>{
    const{username, password} = req.body

    UserModel.findOne({username})
    .then((user)=>{ 
       if(user){
           let isValide = bcrypt.compareSync( password , user.password)

           if(isValide){
           
            req.session.loggedInUser = user
            req.app.locals.isLoggedIn = true;
               res.redirect('/profile')

           }
           else{
               res.render("signinout/login.hbs",{error:"Invalide password "})
           }

       }
       else {
           res.render( "signinout/login.hbs",{error:"User not exist"})
       }
       })
    .catch((err)=>{
       console.log(err)
    })
   
})

router.get('/profile', (req,res,nex)=>{
  if( req.session.loggedInUser){
  res.render('signinout/profile.hbs',{ name : req.session.loggedInUser.username})
  }
  else{
    res.render( "signinout/login.hbs",{error:"Please log in"})
  }
})

router.get('/main', (req,res,nex)=>{
  if( req.session.loggedInUser){
  res.render('signinout/main.hbs')
  }
  else{
    res.render( "signinout/login.hbs",{error:"Please log in"})
  }
})

router.get('/private', (req,res,nex)=>{
  if( req.session.loggedInUser){
  res.render('signinout/private.hbs')
  }
  else{
    res.render( "signinout/login.hbs",{error:"Please log in"})
  }
})

 


module.exports = router;