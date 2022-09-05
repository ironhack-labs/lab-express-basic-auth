const nombre = (req, res, next) => {
    if (req.session.user) {
        console.log('ESTAS EN EL IF')
        const name = req.session.user.username
        return name
    } else {
        console.log('ESTAS EN EL ELSEEEEE')
        const name = ''
        return name
    }
};

module.exports = nombre;