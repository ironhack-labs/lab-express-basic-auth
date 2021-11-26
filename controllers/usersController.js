exports.register = async(req,res) => {
    res.send("Estás en la página de registro")
    }

    exports.viewProfile = async(req,res) => {
        res.render("users/profile")
        }