const router = require('express').Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model');
const isLoggedOut = require('../middlewares/isLoggedOut');

const displaySingup = (req, res) => res.render("auth/singup");
//*function to render singup view

//*logout
router.get("/logout", (req, res) => {
	req.session.destroy((error) => {
		if (error) {
            const errorMessage = error.message;
            res.render("auth/logout", {errorMessage});
            return
		}
		res.redirect("/");
	})
})

router.use(isLoggedOut);

router.get("/singup", displaySingup);
//*calling render function

router.post("/singup", async (req, res, next) => {
    const { username, password } = req.body;

    if(!password || !username) {
        const errorMessage = 'Your password or username are not valid';
        res.render("auth/singup", {errorMessage});
        return
        //*display error message if theres no password or no username.
    }

    try {
      const foundUser = await User.findOne({ username }); //*check if user exist in db
        if (foundUser) {
            const errorMessage = 'You are already registered!'
            res.render("auth/singup", { errorMessage });
            return
            //*display error message if the user is already registered in db.
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        const createdUser = await User.create({
            username,
            password: hashedPassword
        })
        
        res.redirect("/singin");
    } catch(error){
        next(error);
    }
});

router.get('/singin', (req, res) => {
    res.render('auth/singin');
});

router.post('/singin', async (req, res, next) => {
    const { username, password } = req.body;

    if(!password || !username) {
        const errorMessage = 'Please provide username and password';
        res.render("auth/singin", { errorMessage });
        return
    };

    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            const errorMessage = 'Wrong credentials';
            res.render('auth/singin', { errorMessage });
            return
        };

        const checkPassword = bcrypt.compareSync(password, foundUser.password); //*compare passwords
        if (!checkPassword) {
            const errorMessage = 'Wrong credentials';
            res.render('auth/singin', { errorMessage });
            return
        }

        const objectUser = foundUser.toObject();
        //*transform mongo object into js objetc.

        delete objectUser.password;
        //*the password won't be visible in the console.

        req.session.currentUser = objectUser;
        //* to save the new user in the session.
       // console.log('req.session.currentUser', req.session.currentUser);

        return res.redirect('/');

    } catch (error){
        next(error);
    }

})

module.exports = router;