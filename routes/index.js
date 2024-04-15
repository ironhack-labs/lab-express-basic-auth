const router = require("express").Router();
const { getHome } = require("../controllers/misc.controller");
const { 
    signUp,
    doSignUp,
    login,
    doLogin,
    userProfile,
    logout
} = require("../controllers/user.controller");
const  {
    isAuthenticated,
    isNotAuthenticated
} = require("../middlewares/auth.middleware");

/* GET home page */
router.get("/", getHome);

//Sign up
router.get("/signUp", isNotAuthenticated, signUp);
router.post("/signUp", isNotAuthenticated, doSignUp);
router.get("/login", isNotAuthenticated, login);
router.post("/login", isNotAuthenticated, doLogin);
router.get("/user/profile", isAuthenticated, userProfile)
router.get("/logout",isAuthenticated, logout);


module.exports = router;
