const express = require("express");
const router = express.Router();
const random = require('node-dogandcat');
require('dotenv').config();

const giphy = require('giphy-api')(process.env.API);

router.get("/", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/main");   
  } else {                          
    res.redirect("/");        
  } 
});

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next();  
  } else {                          
    res.redirect("/login");        
  }                                
});

router.get("/main", async (req, res, next) => {
  const dog = await random.getRandomDog();
  let foto,video;
  function getExtension(filename) {
    let parts = filename.split('.');
    return parts[parts.length - 1];
  }
  
  function isImage(filename) {
    let ext = getExtension(filename);
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
    let ext = getExtension(filename);
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
  await res.render("user/main", {foto,video} );
});

router.get("/private", async (req, res, next) => {
  const gif = await giphy.random();
  res.render("user/private", {gif});
});

module.exports = router;