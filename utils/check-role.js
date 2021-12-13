
            // roles = ["ADMIN","STAFF"] || ["USER"]
            const checkRole = (roles)=>{

                //sacar al usuario del req.session.currentUser
                return (req,res,next)=>{
                    //{name:"dylan",email:"perro123@perro.com",role:"USER"}
                    const {role} = req.session.currentUser;
                    if(roles.includes(role)){
                        return next()
                    }else{
                        return res.redirect("/noAuth")
                    }
                }
            }
            
            
            module.exports = { checkRole}
            