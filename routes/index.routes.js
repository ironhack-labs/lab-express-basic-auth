const { urlencoded } = require('express');
const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', async (req, res) => {
    // try {
    //     //const data = await Url.find();
    //     console.log(req.session.currentUser);

    //     res.render('index', {loggedUser: req.session.currentUser});
    // } catch (error) {
    //     console.log(error);
    // }
    res.redirect('login');
});


router.use((req, res, next)=> {
    if(!req.session.currentUser){
        res.redirect('/login?sessionExpired=true');
        return ;
    }
    next();
});

router.get('/main', async (req, res) => {
    try {
        //const data = await Url.find();
        console.log(req.session.currentUser);

        res.render('main', {loggedUser: req.session.currentUser});
    } catch (error) {
        console.log(error);
    }
});

router.get('/private', async (req, res) => {
    try {
        //const data = await Url.find();
        console.log(req.session.currentUser);

        res.render('private', {loggedUser: req.session.currentUser});
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
