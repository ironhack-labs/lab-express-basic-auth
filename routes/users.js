const router = require("express").Router();

//Models
const User = require('../models/User.model')

//GET profile page
router.get('/profile', (req, res)=>{
  res.render("profile")
})

// /* GET user by its ID */
// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id).populate('username')

//   // const books = user.books
//   const {username} = user
  
//   res.render("user.hbs", {username});
// });

module.exports = router;