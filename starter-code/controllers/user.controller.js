
module.exports.sessionCreated = (req,res,nex) => {
  res.render('user/options')
}
module.exports.main = (req,res,next) => {
  res.render('user/main')
}

module.exports.private = (req,res,next) => {
  res.render('user/private')
}