const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/create", (req, res, next) => {
  res.render("../views/users/create-user.hbs");
});

router.post("/create", async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  User.create({ username: req.body.username, password: hash }).then(() => {
    res.redirect("/");
  });
});

router.get("/login", isLoggedOut ,(req, res, next) => {
  res.render('../views/users/log-in.hbs');
});

router.post('/login', async (req, res, next) => {
  User.findOne({username: req.body.username}).then(async (user) => {
    const isLoggedIn = await bcrypt.compare(req.body.password, user.password)
    if(isLoggedIn){
      console.log('Your account exists');

      req.session.currentUser = user.toObject();        
      delete req.session.currentUser.password;

      res.redirect('/auth/main')
    }else{
      console.log('Your account doesnt exist');
    }
  })
})

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/user/login");
  });
});

module.exports = router;
