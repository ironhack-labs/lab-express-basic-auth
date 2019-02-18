

const express = require('express');
const router  = express.Router();

router.use((req,res,next)=>{
  console.log('session ',req.session)


if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    console.log('session.........................................')
    
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V

router.get("/yourLoginFine", (req, res, next) => {
  //res.redirect('/yourLoginFine')  <-- not work in here
  res.render("yourLoginFine");
  
});


router.get('/logOut',(req,res,next)=>{

  req.session.destroy((err)=>{
    // can't access session here

    res.redirect("/login");
  })
})




module.exports = router