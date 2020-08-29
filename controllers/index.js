exports.home = (req, res) => {
  let isLogged = false;
  let name = "";
  
  if (req.session.user) {
    isLogged = true;
    name = req.session.user.username
  } 

    res.render("index", { isLogged, name })
  }

exports.main = (req, res) => {  
  
  if (req.session.user) {
    res.render("main")
  } else {
    res.redirect("/notLogged")
  }
  
}  

exports.private = (req, res) => {
  if (req.session.user) {
    res.render("private")
  } else {
    res.redirect("/notLogged")
  }
}

exports.notLogged = (req, res) => {
  res.render("notLogged")
}