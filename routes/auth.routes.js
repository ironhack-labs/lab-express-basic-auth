const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// const displaySignup = (req, res) => res.render("auth/signup")

router.get("/signup", (req, res) => {
	res.render("auth/signup");
});

// router.get("/signup", displaySignup)

router.post("/signup", async (req, res) => {
	const { email, password } = req.body;
	//Check the user has filled email and password fields
	if (!password || !email) {
		const errorMessage = `Please fill out password and email`;
		res.render("auth/signup", { errorMessage });
		return;
	}
	//Check email is corrent and password is strong
	const emailRegex= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const regex =  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

	if(!regex.test(password)){
		return res.render("auth/signup",{
			errorMessage:"Password needs to be 8 char long, including lower, upper case and at least one digit",
		});
	}

	if(!emailRegex.test(email)){
		return res.render("auth/signup",{errorMessage: "Please provide a valid email"});
	}
	try {
		//Creck if user is unser name of email is unique(already exist in DB)
		const foundUser = await User.findOne({ email })
		if (foundUser) {
			const errorMessage = `You are already registered !`;
			res.render("auth/signup", { errorMessage });
			return;
		}

		//Encrypt password
		const salt =bcrypt.genSaltSync(12);
		const hashedPassword = bcrypt.hashSync(password, salt);
		
		//Create user in DB
		const createdUser = await User.create({
			email,
			password: hashedPassword,
		});
		const objectUser = createdUser.toObject();
		delete objectUser.password;
		req.session.currentUser = objectUser;
		
		res.redirect("/auth/signin")
	} catch (e) {
		console.log(e)
	}
});

router.get("/signin", (req,res)=>
{
	res.render("auth/signin")
});

router.post("/signin", async (req,res, next)=>{
const { email, password } = req.body;

if(!email ){
	res.render("auth/signin",{errorMessage: "Email not found, please sign up"});
	return;
}
try {
	const foundUser = await User.findOne({ email });

	if(!foundUser){
		return res.render("auth/signin", {errorMessage: "Email not registered"})
	}
	const checkPassword = bcrypt.compareSync(password,foundUser.password);
	
	if(checkPassword){
		
		const objectUser = foundUser.toObject();
		delete objectUser.password;
		req.session.currentUser = objectUser;
		return res.redirect("/profile");
	}else{
		res.redirect("auth/signin",{errorMessage: "Wrong password"});
		return;
	}
} catch (error) {
	next(error);
	}
});


router.get("/logout", (req, res, next) =>{
	req.session.destroy();
	res.redirect("/auth/signin");
});

module.exports = router;
