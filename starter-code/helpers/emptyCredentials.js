// middleware function to validate credentials
const emptyCredentials = (req, res, next) => {
  let { username, password } = req.body;
  if (username == "") {
    res.render("auth/login-signup", {
      err: "Username is empty!",
      login: req.url.includes("login")
    });
    return;
  }
  if (password == "") {
    res.render("auth/login-signup", {
      username,
      err: "You must provide a password!",
      login: req.url.includes("login")
    });
    return;
  }
  next();
};

module.exports = emptyCredentials;
