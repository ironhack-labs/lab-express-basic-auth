const auth = async(req,res) =>{
    const token = req.get('Authorization')
    if(!token){
      res.status(401).json({message: 'Request without token'})
    }
    const tokenWihtoutBearer = token.split(' ')[1]
    try {
    const decodedToken = jwt.verify(tokenWihtoutBearer,process.env.SECRET)
    req.user = {...decodedToken}
    next()
    } catch (error) {
    res.status(401).json({message: message.error})
    }
}
module.exports = auth