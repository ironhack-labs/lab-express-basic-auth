const isLoggedIn = (req, res, nex) => {
    if(!req.session.user) {
        res.redirect('/')
        return;
      }
      nex();
}

const isAnon = (req, res, nex) => {
    if(req.session.user) {
        res.redirect('/profile')
        return;
      }
      nex();
}

module.exports = {isLoggedIn, isAnon}