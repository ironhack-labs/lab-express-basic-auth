const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { userName, userPassword, userEmail } = req.body;
  const validationErrors = {
    userNameError: "",
    userPasswordError: "",
  };
  if (userName.trim().length === 0) {
    validationErrors.userNameError = "Campo Obrigatório";
  }
  if (userEmail.trim().length === 0) {
    validationErrors.userEmailError = "Campo Obrigatório";
  }
  if (userPassword.trim().length === 0) {
    validationErrors.userPasswordError = "Campo Obrigatório";
  }
  if (Object.keys(validationErrors).length > 0) {
    res.render("signup", validationErrors);
    return;
  }

  try {
    const userFromDb = await User.find({ email: userEmail });
    if (userFromDb) {
      return res.render("/signup", {
        userEmailError:
          "Este email já foi cadastrado no nosso sistema. Por favor, escolha outro",
      });
    }
  } catch (error) {}
});

module.exports = router;
