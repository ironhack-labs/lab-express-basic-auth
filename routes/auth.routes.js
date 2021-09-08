const { Router } = require("express")
const router = new Router()
const bcryptjs = require("bcryptjs")
const saltRounds = 10
const User = require("../models/User.model")
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js")

router.get("/signup", (req, res) => {
	res.render("signup")
})

router.get("/user-profile", (req, res) => {
	res.render("user-profile.hbs")
})

router.post("/signup", (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		res.render("signup", { errorMessage: "You have to provide an username and a password!" })
		return
	}

	bcryptjs
		.genSalt(saltRounds)
		.then((salt) => bcryptjs.hash(password, salt))
		.then((hashedPassword) => {
			return User.create({
				username: username,
				password: hashedPassword,
			})
		})
		.then((userFromDB) => {
			res.redirect("/user-profile")
		})
		.catch(console.log("error"))
})

router.get("/login", (req, res) => {
	res.render("login")
})

router.post("/login", (req, res, next) => {
	console.log("SESSION =====> ", req.session)

	const { username, password } = req.body

	if (username === "" || password === "") {
		res.render("login", {
			errorMessage: "Please enter both, username and password to login.",
		})
		return
	}

	User.findOne({ username })
		.then((user) => {
			if (!user) {
				res.render("login", { errorMessage: "Username is not registered. Try with other Username." })
				return
			} else if (bcryptjs.compareSync(password, user.password)) {
				req.session.currentUser = user

				res.render("user-profile", { user })
			} else {
				res.render("login", { errorMessage: "Incorrect password." })
			}
		})
		.catch((error) => next(error))
})

router.get("/main", (req, res) => {
	res.render("main")
})

router.get("/private", isLoggedIn, (req, res) => {
	res.render("private")
})

module.exports = router
