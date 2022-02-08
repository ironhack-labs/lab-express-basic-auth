
exports.getHome = (req,res) => { 
    res.render('index')
}

exports.getProfile = (req,res) => {
    console.log(req.session)
    const { currentUser } = req.session

    const username = currentUser ? currentUser.username : '' ;
    const msg = currentUser ? currentUser.msg : "";
    res.render('profile',{ 
        username, 
        msg 
    })
}

