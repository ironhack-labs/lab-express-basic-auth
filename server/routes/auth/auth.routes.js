const Router = require('express')
const router = Router()
const User = require('../../models/User.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup',async(req,res)=>{
  const {username,email,password}=req.body
  if(!username || !email || !password){
    res.status(400).json({message: 'Provide valid email, password'})
    return
  }
  const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ 
  if(!regexEmail.test(email)){
    res.status(400).json({message: 'Provide valid email'})
    return
  }
  const regexPassword =/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
  if(!regexPassword.test(password)){
    res.status(400).json({message: 'Provide passswor with 1 uppercase letter ,1 lowecase letter, 1 number ,1 especial character and have eight digits'})
    return
  }
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password,salt) 
  try {
    const foundedUser = await User.findOne({email})
    if(foundedUser){
        res.status(400).json({message:'User already exists'})
        return
    }
    const user = await User.create({username,email,passwordHash})
    res.status(200).json({_id: user.id,username,email})
  } catch (error) {
    res.status(500).json({message: error.message})
  }

})
router.post('/login',async(req,res)=>{
    const {username,email,password} = req.body
    try {
            const user = await User.findOne({username,email})
        if(!user){
          res.status(404).json({message: 'User not found'})
          return
        }
        const checkPassword = bcrypt.compareSync(password,user.passwordHash)
        if(!checkPassword){
         res.status(400).json({message: 'Invalid email or password'})
         return
        }
        const payload = {
            _id: user.id,
            username,
            email
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '1d'})
        res.status(200).json({...payload,token})    
    } catch (error) {
        res.status(500).json({message: 'Error Internal Server'})
    }
})
module.exports = router