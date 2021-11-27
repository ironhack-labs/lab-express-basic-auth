const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user.model");

function getSignup(req, res) {
  const { err } = req.query;
  res.render("signup", { err });
}

function getLogin(req, res) {
  const { err } = req.query;
  res.render("login");
}

const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

function hasWrongFormat(password) {
  return !passwordRegex.test(password);
}

function isValidationError(error) {
  // check if the error object is an instance of mongoose ValidationError contructro function
  return error instanceof mongoose.Error.ValidationError;
}

function isMongoError(error) {
  // when mongo throws an error it gives it the code 11000
  return error.code === 11000;
}

async function signup(req, res) {
  try {
    const { username, password } = req.body;
    const hasMissingCredentials = !username || !password;
    if (hasMissingCredentials) {
      return res.redirect("/signup?err=Missing Credentials");
    }
    if (hasWrongFormat(password)) {
      return res.redirect("/signup?err=Wrong format");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { password: newVar, ...newUser } = await User.create({
      email,
      password: hashedPassword,
    }).lean();
    console.log("newuser", newUser);
    req.session.currentUser = newUser;
    return res.redirect("/private");
  } catch (err) {
    if (isValidationError(err)) {
      return res.redirect("/signup?err=validation error");
    }
    if (isMongoError(err)) {
      return res.redirect("/signup?err=email in use");
    }
    console.error(err);
    return res.redirect("/signup?err=something went wrong");
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const hasMissingCredentials = !username || !password;

    if (hasMissingCredentials) {
      return res.redirect("/login?err=Missing Credentials");
    }
    if (hasWrongFormat(email, password)) {
      return res.redirect("/login?err=Wrong format");
    }

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.redirect("/login?err=user not found");
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (correctPassword) {
      const { password, ...currentUser } = user;
      req.session.currentUser = currentUser;
      return res.redirect("/private");
    }
    return res.redirect("/login?err=wrong password");
  } catch (err) {
    if (isValidationError(err)) {
      return res.redirect("/login?err=validation error");
    }
    if (isMongoError(err)) {
      return res.redirect("/login?err=mongo error");
    }
    console.error(err);
    return res.redirect("/login?err=something went wrong");
  }
}

async function logout(req, res) {
  try {
    await req.session.destroy();
    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getLogin, getSignup, signup, login, logout };