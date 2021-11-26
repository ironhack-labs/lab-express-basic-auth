exports.profile = async (req, res) => {
      res.render("users/profile");
}


exports.main = async (req, res) => {
    res.render('users/main');
};


exports.private = async (req, res) => {
    res.render('users/private');
};