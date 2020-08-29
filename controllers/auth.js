const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

exports.signupPage = (req, res) => {
    res.render('auth/signup');
}

exports.signup = async(req, res, next) => {
    // Extraction of the data from the form
    const {
        username,
        pwd
    } = req.body;

    // Check if fields aren't empty
    if (username === '' || pwd === '') return res.render('auth/signup', {
        error: "Missing fields"
    })

    // Check if username doesn't exist yet
    const usernameExists = await User.findOne({
        username
    });
    if (usernameExists) return res.render('auth/signup', {
        error: "Username already used... Please try another one"
    });

    // Hash the password
    const salt = bcrypt.genSaltSync(12);
    const hashPwd = bcrypt.hashSync(pwd, salt);

    // Create the user in the DB
    const user = await User.create({
        username,
        pwd: hashPwd
    })

    // Redirect
    res.redirect("/login");
}

exports.loginPage = (req, res) => {
    res.render('auth/login');
}

exports.login = async(req, res) => {
    const error = "Error, please try again";

    // Extract info from the form
    const {
        username,
        pwd
    } = req.body;

    // Check if missing fields
    if (username === '' || pwd === '') return res.render('auth/login', {
        error: "Missing fields"
    })

    // Check if user exsists before going on
    const existingUser = await User.findOne({
        username
    })
    if (!existingUser) return res.render('auth/login', {
        error
    })

    // Check if password is correct
    if (bcrypt.compareSync(pwd, existingUser.pwd)) {
        req.session.user = existingUser;
        res.redirect('/main')
    } else return res.render('auth/login', {
        error
    })
}