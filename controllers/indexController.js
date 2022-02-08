const res = require("express/lib/response")

exports.getHome = (req, res) => {
    res.render("index")
}

exports.getProfile = (req, res) => {            //!!!!!!!!!!!!!
	console.log(req.session)

    const {currentUser} = req.session

    const username = currentUser ? currentUser.username : ""
    const email = currentUser ? currentUser.email : ""
    const msg = currentUser ? currentUser.msg : ""

	res.render("profile", {
        username,
        email,
        msg
    })
}