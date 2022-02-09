// ./controllers/indexController.js

// 1. CONTROLLERS

exports.getHome = (req, res) => {

	res.render("index")

}

exports.getProfile = (req, res) => {

	// console.log(req.session)
	// const{currentUser} = req.session

	// // SOLUCIÓN 1
	// const username = currentUser ? currentUser.username : ""
	// const email = currentUser ? currentUser.email : ""
	// const msg = currentUser ? currentUser.msg : ""

	res.render("profile")


}