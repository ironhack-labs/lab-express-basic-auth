const router = require('express').Router();

const mongoose = require('mongoose');
const Thing = require('../models/Thing');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');
router.get('/signup',(req,res)=>res.render('thing/signup'))
router.post('/signup',async(req,res,next)=>{
    try {
        let{username,password}=req.body;
        if(!username||!password){
            res.render('thing/signup',{errorMessage:'Please fill all the fields'})
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)
        await Thing.create({username,password:hashedPassword});
        res.redirect('/')
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError){
            res.render('thing/signup',{
                errorMessage:error.message,
            });
        }else if(error.code===11000){
            res.render('thing/signup',{
                errorMessage:'Email alreadt registered',
            })
        }
        console.log(error);
        next(error);
        }
    });
    router.get('/login', isLoggedOut,(req,res)=>('thing/login'))

    router.post('/login', async (req, res, next) => {
        try {
          let { email, password } = req.body;
      
          if (!password || !email) {
            res.render('thing/login', { errorMessage: 'Please input all the fields' });
          }
      
          let thing = await Thing.findOne({ email });
      
          if (!thing) {
            res.render('thing/login', { errorMessage: 'Account does not exist' });
          } else if (bcrypt.compareSync(password, thing.password)) {
            req.session.thing = thing;
      
            res.redirect('/profile');
          } else {
            res.render('thing/login', { errorMessage: 'Wrong credentials' });
          }
        } catch (error) {
          console.log(error);
          next(error);
        }
      });
      
      router.get('/profile', isLoggedIn, (req, res) => {
        let thing = req.session.thing;
      
        res.render('profile', thing);
      });
      
      router.post('/logout', (req, res, next) => {
        req.session.destroy((err) => {
          if (err) next(err);
          else res.redirect('/');
        });
      });

module.exports=router