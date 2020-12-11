const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));
router.get('/signup', (req, res) => res.render('view/signup'));

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const randomString = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, randomString)
        const newUser = await User.create({ username, email, password: hashedPassword })
        res.redirect('/')
        console.log('New User:', newUser)
    } catch (err) {
        console.log('There is an error:', err)
    }
})

module.exports = router;
