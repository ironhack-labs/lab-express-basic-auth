const
  express     = require('express'),
  siteRoutes  = express.Router(),
  User        = require(`../models/User`)
;

/* GET home page */
siteRoutes.get('/', (req, res, next) => {
  res.render('index');
});

siteRoutes.get(`/user`, (req,res) => {
  const current = req.session.currentUser;
  // res.json(current)
  res.render(`current`, {current});
});

// Secret pages only on session
siteRoutes.use( (req, res, next) => {
  if (req.session.currentUser) next();
  else res.redirect(`/login`);
});

siteRoutes.get(`/user/:user`, (req, res) => {
  User
    .findOne({username: req.params.user})
    .then( user => res.render(`private/user`, {user}) )
  ;
});

siteRoutes.get(`/user/:user/cat`, (req,res) => {
  User
    .findOne({username: req.params.user})
    .then( user => res.render(`private/main`, {user}) )
  ;
});

siteRoutes.get(`/user/:user/gif`, (req,res) => {
  User
    .findOne({username: req.params.user})
    .then( user => res.render(`private/private`, {user}) )
  ;
});

module.exports = siteRoutes;