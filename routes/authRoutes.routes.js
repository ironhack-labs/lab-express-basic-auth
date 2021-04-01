const express = require("express");
const User = require("../models/User.model");
const passwordManager = require("../utils/passwordManager");

const router = express.Router();

router.get("/signup", (req, res) => res.render("auth-views/signup"));

router.post("/signup", async (req, res, netx) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.render("auth-views/signup", {
        errorMessage:
          "Nome de usuário já está em uso. Por favor, escolha outro",
      });
      return;
    }

    const newUser = new User({
      username,
      password: await passwordManager.encryptPassword(password),
    });
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    return netx(error);
  }
});

router.get("/login", (req, res) => res.render("auth-views/login"));

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (
      !existingUser ||
      !passwordManager.verifyPassword(password, existingUser.password)
    ) {
      res.render("auth-views/login", {
        errorMessage: "Nome de usuário ou senha incorretos",
      });
      return;
    }
    //iniciar uma sessão para este usuário
    req.session.currentUser = existingUser; //trocar userFromDb por existinUser
    //encaminha o usuário para a sua área logada
    res.redirect("/main");
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
