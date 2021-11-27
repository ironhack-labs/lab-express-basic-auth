function goHome(req, res) {
    res.render("index");
  }
  
  function goPrivate(req, res) {
    console.log("session", req.session);
    res.render("private");
  }
  
  module.exports = { goHome, goPrivate };