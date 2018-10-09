const
  express        = require(`express`),
  authRoutes     = express.Router(),
  bcrypt         = require(`bcrypt`),
  bcryptSalt     = 10,
  User           = require(`../models/User`)
;

authRoutes.get( `/signup`, (req,res) => res.render(`auth/signup`, {signup: true}) );

authRoutes.post(`/signup`, (req,res) => {
  const
    username = req.body.username,
    password = req.body.password,
    salt     = bcrypt.genSaltSync(bcryptSalt),
    hashPass = bcrypt.hashSync(password, salt)
  ;
  if (username === `` || password === ``) res.render(`auth/signup`, {errorMessage: `All fields are requiered`, signup: true});
  User
    .findOne({username: username})
    .then( user => {
      const
        newuser = User({
          username,
          password: hashPass
        })
      ;
      if (user !== null) res.render(`auth/signup`, {errorMessage: `Username already exists`, signup: true});
      else {
        User
          .create(newuser)
          .then(() => res.redirect(`/login`))
        ;
      }
    })
  ;
});

authRoutes.get( '/login', (req,res) => res.render(`auth/login`, {login: true}) );

authRoutes.post(`/login`, (req,res) => {
  const
    username = req.body.username,
    password = req.body.password
  ;
  if (username === `` || password === ``) res.render(`auth/login`, {errorMessage: `All fields are requiered`, login: true});
  User
    .findOne({username: username})
    .then( user => {
      if (!user) res.render(`auth/login`, {errorMessage: `User doesn't exists`, login: true});
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect(`/user/${user.username}`);
      } else {
        res.render(`auth/login`, {errorMessage: `Incorrect password`, login: true});
      }
    })
  ;
});

authRoutes.get(`/logout`, (req,res) => {
  req.session.destroy( () => res.redirect(`/`) );
});



module.exports = authRoutes;