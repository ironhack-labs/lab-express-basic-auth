require('dotenv').config()
const bcrypt = require('bcrypt')
const User = require('../models/Users')



exports.signUpUser = async (req, res) => {
  const {userName, password} = req.body

  console.log('----', userName, password)

  if(!userName || !password ){
    let err = new Error
    console.log(err, "Se chingo el signup")
    res.redirect("/login")
  } else{
      const salt = await bcrypt.genSalt(Number(process.env.SALT))
      const hashed = await bcrypt.hash(password, salt)

      try {
        const user = await User.create({userName, password: hashed})
        console.log('new sign up user: ', user)
        res.redirect('/login')
      } catch (e) {
        console.log(e, 'error on login')
        res.redirect('/signup?error=duplicated_userName')
      }
  }
}

exports.loginUser = await = async (req, res) => {
    const {userName, password} = req.body
    const user = await User.findOne({userName})

  console.log(user, 'user')

    if (!user) {
      res.redirect("/login?error=true")
    } else {
      const correct = await bcrypt.compare(password, user.password)
        if (correct) {
            req.session.loggedUser = user
            req.app.locals.loggedUser = user
            res.redirect('/main')
        } else {
            res.redirect('/login?error=true')
        }
    }
    }


exports.loginPage=(req, res) => {
  const {error} = req.query
 res.render("login", { error })
}
exports.signUpPage=(req, res) => {
  const {error} = req.query
  res.render("signUp", { error })
}

exports.profilePage=(req, res) =>{
  const user = req.session.loggedUser

  if(user) {
    res.render("profile", user)
  } else {
    res.redirect("/login")
  }
}

exports.mainPage=(req, res) =>{
  const user = req.session.loggedUser

  if(user) {
    res.render("main", user)
  } else {
    res.redirect("/")
  }
}

exports.privatePage=(req, res) =>{
  const user = req.session.loggedUser

  if(user) {
    res.render("private", user)
  } else {
    res.redirect("/login")
  }
}

exports.logout= async(req, res) =>{
  await req.session.destroy()
    res.redirect('/')
}
