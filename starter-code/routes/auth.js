const express = require("express");
const router = express.Router();
const userModel = require("../Models/User");
const bcrypt = require("bcryptjs");


router.get("/signup", (req, res) => {
    res.render("auth/signup", {js : ["signup"]});

});

router.get("/signin", (req, res) => {
    res.render("auth/signin");
});

// Register new user //

router.post("/signup", (req,res, next) => {
    const user = req.body;
    if(!user.username || !user.password) {
        // req.flash("please enter your login and password")
        res.redirect("/auth/signup");
        return;
    } else {
        userModel
        .findOne({username: user.username})
        .then(dbRes => {
            console.log(req.body);
                if(dbRes) return res.redirect("/auth/signup");      
                const salt = bcrypt.genSaltSync(10);
                const hashed = bcrypt.hashSync(user.password, salt);
                user.password = hashed;

                userModel
                    .create(user)
                    .then(() => res.redirect("/auth/signin"));
        })
        .catch(err => console.error(err)) ;
    }
});

// LOGGING IN //

router.post("/signin", (req, res, next) => {
    const user = req.body;

    if(!user.username || !user.password) {
       // req.flash("error", "wrong credentials mate") ;
        return res.redirect("/auth/signin");
    }

    userModel
        .findOne({username: user.username})
        .then(dbRes => {
            if (!dbRes) {
                //on n'a pas trouvé d'user avec ce username
                // req.flash("error", "wrong cred");
                return res.redirect("/auth/signin");
            }
            // on a trouvé un utilisateur!
            if (bcrypt.compareSync(user.password, dbRes.password)) {
                // le mdp match
                const { _doc: clone } = {...dbRes};
                delete clone.password

                req.session.currentUser = clone;
                return res.redirect("/dashboard");

            } else {
                return res.redirect("/auth/signin");
            }
        })
        .catch(next);
});


// router.get("/admin", protectRoute, (req, res, next) => {
    
//         res.render("auth/admin", {
//           albums: dbResults
//         });
//       })
//       .catch(next);
//   });



module.exports = router;