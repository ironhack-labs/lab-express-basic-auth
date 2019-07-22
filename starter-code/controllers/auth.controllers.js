const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.getSignup = (req, res, next) => {
	res.render("auth/signup");
};

exports.postSignup = async (req, res, next) => {
	const { username, password } = req.body;

	if (username === "" || password === "") return res.render("auth/signup", { err: "Username and Password cannot be empty" });

	const users = await User.find({ username });
	if (users.length !== 0) return res.render("auth/signup", { err: "User already exists" });

	const salt = bcrypt.genSaltSync(10);
	const hashPassword = bcrypt.hashSync(password, salt);
	await User.create({ username, password: hashPassword });

	res.redirect("/");
};

exports.getLogin = (req, res, next) => {
	res.render("auth/login");
};

exports.postLogin = async (req, res, next) => {
	const { username, password } = req.body;

	if (username === "" || password === "") return res.render("auth/login", { err: "Username and Password cannot be empty" });

	const user = await User.findOne({ username });
	if (!user) return res.render("auth/login", { err: "User doesn't exist" });

	if (!bcrypt.compareSync(password, user.password)) return res.render("auth/login", { err: "Invalid password" });

	req.session.currentUser = user;
	res.redirect("/");
};
