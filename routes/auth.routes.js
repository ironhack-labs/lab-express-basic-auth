//we need to give the variable "router" ability to use express
const router = require('express').Router();
//allowing our file to access the jumble up package
const bcrypt = require('bcryptjs');
//allowing our file to have mongoose traits
const mongoose = require('mongoose');
//bringing out the model we created for the user
const User = require('../models/User.model');
//getting the middlewares from the folder middleware to have them redirecting users in case of logout or login
const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard')

//---------------------------------------------

        //Signup

//we need to create a view and a url for our signup
router.get('/signup', (req,res) => //->url
    res.render('auth/signup'))  //->folder/file location

//we need to post our information that we're getting from the model and confirm everything's validity
router.post ('/signup', async(req,res,next) => {
    try {
        //we're taking information out of the model by deconstructing it
        let {username, password} = req.body;

        //here, we make sure that if the user does not inpit the proper information, a error pops up
        if(!username || !password) {
            res.render('auth/signup', {errorMessage: 'Please input all fields!'})
        }


    //after we make sure all fields have been inputed, we need to check first if the password passes our test using regEx:

        const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        //now, we test it:
        if (!regEx.test(password)) {
            res.render('auth/signup', {errorMessage: 'Your password needs to be 8 characters or more, include lower and upper cased letters and at least 1 number and 1 special character'});
        }

        //now, it's time for us to jumble up the password using bcrypt:
        const salt = await bcrypt.genSalt (8) //->jumbling up the password 8 times.

        //then, we mix up our password with the jumalaya comming from the algorithm to have an "encrypted" password
        const hashedPassword = await bcrypt.hash(password, salt)

        //finally, we create the user
        await User.create({username, password:hashedPassword});
        //->we used password:hashPassword because we want to use link to the user the jumbled up password.

        //then, we redirect this new user haver signup is completed to our home page:
        res.redirect('/')

    } catch (error) {

        //now, we try to find the errors the user made during signup and prevent them from advancing without correcting them
            if(error instanceof mongoose.Error.ValidationError) {   //-> and this error instanceof mongoose.Error.ValidationError is for us to check if WE made a mistake during the creation of the user model
                res.render('auth/signup', {
                    errorMessage: error.message}); //-> this error.message is the message we placed on the model insde of username->required. required: [true, 'Please submit a username'] so, the warning we get is the one in the ''.

                } else if (error.code === 11000){ //-> with this error code, we protecting ourselfs by sending a warning if the username we're trying to register with is already in the database
                    res.render('auth/signup', {errorMessage: 'This username is already registred'})
                }
                console.log(error);
                next(error);
            }
        
    });


        //Login

        //the same for the login part, we need to create the URL and the view file and get access to it

        router.get('/login',  /* isLoggedOut, */  (req,res) => { //->URL we want to have.
            //isLoggedOut because we wnat, before anything happens for the middleware to be used, to confirm if we are in session already or not. if we are, there's no need to login again.
            res.render('auth/login')}); //-> our foulder/file location

        router.post('/login', async (req,res,next) => {
            try {

                //we grab the username  and passoword out of the form inputs and save it in the req.body
                let {username, password} = req.body;

                //if the user did NOT type the username or the password then a warning arises and user is kept at login page
                if(!username || !password) {
                    res.render('auth/login', {errorMessage: 'Please input all fields!'});
                }


                //then, we need to check if the username exists:
                let user = await User.findOne({username})

                if (!user) {//we'll try to find the user. if we can't, then:
                    res.render('auth/login', {errorMessage: 'Account does not exist'})
                } else if (bcrypt.compareSync(password, user.password)){ //-> here, we compare the password inputed and the password we have saved on our database. if it matches, then we carry on.
                    //we save the user's session on live - cookies
                        req.session.user = user;
                    


                    // the user can now login
                    res.redirect('/private')
                    return 
                } else {    //-> we checked the user, we checked the user AND password. now what's left is to check:
                    //if the password is wrong, then we do:
                    res.render('auth/login', {errorMessage: 'Wrong Password!'})
                }

            } catch (error) {
                console.log(error)
                next(error)
            }

        });

        //Authorizations!
//now, we need to make sure that a person that is already logged in isn't dragged to the login page and that a person that isn't logged in can access the profile page like a logged in user would/could

router.get('/private', /* isLoggedIn, */ (req,res) => {
    //isLoggedIn is in the middleware folder/file. check for more infop

    //we go to the back-end, then we go to the session, take the object and send it to the front-end
    let user = req.session.user;
    
    res.render('profile', {user})
})

router.post('/logout', (req,res,next) => {  //->/logout is the URL 
    //in order for us to shut down the session, we have to destroy it.
    req.session.destroy((error) => {
        //if there is an error, we want it to be displayed
        if(error) {next(error)}
        //else, once we log out, we want to site to send us back to the home page
        else {res.redirect('/')}
    });
});

module.exports = router;















