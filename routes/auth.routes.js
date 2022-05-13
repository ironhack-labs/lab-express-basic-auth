const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

// const displaySignup = (req, res) => res.render("auth/signup")

router.get("/signup", (req, res) => {
	res.render("auth/signup")
})

// router.get("/signup", displaySignup)

router.post("/signup", async (req, res) => {
	const { email, password } = req.body

	if (!password || !email) {
		const errorMessage = `Your password or email are not valid`
		res.render("auth/signup", { errorMessage })
		return
	}

	try {
		const foundUser = await User.findOne({ email })

		if (foundUser) {
			const errorMessage = `You are already registered !`
			res.render("auth/signup", { errorMessage })
			return
		}

		const hashedPassword = bcrypt.hashSync(password, 12)
		const createdUser = await User.create({
			email,
			password: hashedPassword,
		})
		res.redirect("/profile")
	} catch (e) {
		console.log(e)
	}
})

module.exports = router
