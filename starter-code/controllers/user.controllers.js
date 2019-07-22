const bcrypt = require('bcrypt')
const User = require('../models/User')



exports.getHome =(req,res,next) =>{
  res.render( 'index')
}


exports.getMain = (req,res , next) => {
  res.render('auth/main')
}

exports.getPrivate = (req,res , next) => {
  res.render('auth/private')
}



exports.getSignup =  (req,res,next )=> {
  res.render('auth/signup')
}

exports.postSignup = async (req,res,next) => {
  let { username, password } = req.body;

  if (username === "" || password === "") 
  return res.render("auth/signup", { err: "Please fill all the fields" });

	const users = await User.find({ username });
  if (users.length !== 0) 
  return res.render("auth/signup", { err: "User already exists" });

	const salt = bcrypt.genSaltSync(10);
	const hashPassword = bcrypt.hashSync(password, salt);
	await User.create({ username, password: hashPassword });

	res.redirect("/");
}


exports.getLogin = (req,res,next) => {
  res.render('auth/login')
}
      
exports.postLogin =  async (req,res,next) => {
  let { username, password } = req.body;

  if (username === "" || password === "") 
  return res.render("auth/login", { err: "Please fill all the fields" });

	const user = await User.findOne({ username });
	if (!user) return res.render("auth/login", { err: "User doesn't exist" });

  if (!bcrypt.compareSync(password, user.password)) 
  return res.render("auth/login", { err: "Invalid password" });

	req.session.currentUser = user;
	res.redirect("/");
}





