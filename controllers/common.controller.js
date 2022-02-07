module.exports.home = (req, res, next) => {
    console.log('entro a home')
    res.render('common/home');
}