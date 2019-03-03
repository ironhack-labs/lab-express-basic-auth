const express = require('express');
const router  = express.Router();
const uploadCloud = require('../routes/cloudinary.js');
const Image = require('../models/image')
// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;



/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/post", (req, res, next) => {
  res.render("post");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
    if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
  
      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        res.redirect("/");
      })
      .catch(error => {
        console.log(error);
      })
  })
  .catch(error => {
    next(error);
  })
});

//LOGIN

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/secret");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});


router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/secret", (req, res, next) => {
  res.render("secret");
});

/* GET IMAGE PAGE */
router.get('/post-image', (req, res, next) => {
  Image.find()
  .then(imagesFromDB => {
    res.render('post', {images: imagesFromDB});
  })
});


router.post('/add', uploadCloud.single('photo'), (req, res, next) => {
  const { title, description } = req.body;
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const newImage = new Image({title, description, imgPath, imgName})
  newImage.save()
  .then(image => {
    res.redirect('/post-image');
  })
  .catch(error => {
    console.log(error);
  })
});


module.exports = router;

