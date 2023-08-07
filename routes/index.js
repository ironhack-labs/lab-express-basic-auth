module.exports = app => {
    const indexRoutes = require("./../routes/index.routes")
    app.use("/", indexRoutes)

    const signupRoutes = require("./../routes/signup.routes")
    app.use("/auth", signupRoutes)


    const userRoutes = require("./../routes/user.routes")
    app.use("/user", userRoutes)

}