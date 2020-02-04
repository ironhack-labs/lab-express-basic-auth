const express = require('express');
const router  = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt"); // intro to bcrypt hashing algorithm https://www.youtube.com/watch?v=O6cmuiTBZVs
const protectRoute = require("../middlewares/protectRoute")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup')
});


router.get("/signin", (req, res) => {
  res.render("signin");
});

router.get("/main", (req, res) => {
  res.render("main")
})

router.get("/private", protectRoute, (req, res) =>{
  res.render("private")
})


router.post('/signup', protectRoute, (req, res , next) => {
  const user = req.body;
  if (!user.username || !user.password) {

    res.redirect("signup");
    return;
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) {
          console.log("user name already exist")
          return res.redirect("signup"); //
        }

        const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
        user.password = hashed; // new user is ready for db
    
        userModel.create(user).then(() => res.redirect("signin"));
        // .catch(dbErr => console.log(dbErr));
      })
      .catch(next);
  }
});



router.post("/signin", (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    console.log("one field is missingcl")
    return res.redirect("signin");
  }

  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        // no user found with this email
        console.log("no user found with this name")
        return res.redirect("signin");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user

        delete clone.password; // remove password from clone
        // console.log(clone);

        req.session.currentUser = clone; // user is now in session... until session.destroy
        console.log("vous êtes connecté YiPEEEEE!")
        return res.redirect("/");
      } else {
        // encrypted password match failed
        console.log("Erreur de mot de passe")
        return res.redirect("signin");
      }
    })
    .catch(next);
});

module.exports = router;
