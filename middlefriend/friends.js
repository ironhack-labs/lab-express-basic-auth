function checkEmpty(req, res, next){
    const name = req.body.name;
    const pass = req.body.password;
    
    if(!name || !pass){
        return res.redirect('/ath');
    }
    next()
}

module.exports = {
    checkEmpty,
}