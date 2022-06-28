//creamos un middleware para checar los roles que tienen permitidor acceder o realizar daterminadas acciones

                //["ADMIN,"STAFF"]
exports.checkRole =(arrayRoles) => {

return (req,res,next)=>{
    //voy a sacar de mi req.session al user logged para saber qe rol tiene

    const { role} = req.session.currentUser
    if(arrayRoles.includes(role)){
        return next()
    } else {
        return res.status(403).render("auth/adminNotAuth")
    }


}
}