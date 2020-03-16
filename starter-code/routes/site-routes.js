const express = require("express");
const router = express.Router();
const random = require('node-dogandcat');
const giphy = require('giphy-api')();


//renderiza la plantilla la.hbs
router.get("/", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/main')
  }
  res.render("/");
});

// verificamos si el usuario tiene una session activa, de ser así, lo redirigimos a la siguiente ruta, en este caso
// /secret
// en caso contrario, redirigimos al usuario a /login

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route 
  } else {
    res.redirect("/login");
  }
});

// renderizamos la plantilla secret.hbs con el username
// deconstruimos en la variable username el username de req.session.currentUser

router.get("/main", async (req, res, next) => {
  const dog = await random.getRandomDog();
  let foto;
  let video;

  function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  function isImage(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        return true;
    }
    return false;
  }

  function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        return true;
    }
    return false;
  }
  if (isImage(dog)) {
    foto = dog;
  }
  if (isVideo(dog)) {
    video = dog;
  }
  await res.render("user/main", {
    foto,
    video
  });
});

router.get("/private", async (req, res, next) => {
  const gif = await giphy.random()
  res.render("user/private", {
    gif
  });
});

module.exports = router;