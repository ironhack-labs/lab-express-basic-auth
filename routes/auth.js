router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.render('login', { errorMessage: 'All fields are mandatory.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('login', { errorMessage: 'Invalid credentials.' });
        }

        const passwordCorrect = bcrypt.compareSync(password, user.password);
        if (!passwordCorrect) {
            return res.render('login', { errorMessage: 'Invalid credentials.' });
        }

        req.session.currentUser = user;
        res.redirect('/main');
    } catch (error) {
        res.render('login', { errorMessage: 'Something went wrong. Please try again.' });
    }
});
