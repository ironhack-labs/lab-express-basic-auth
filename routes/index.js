module.exports = (app) => {
  // Authentication URLS
  app.use("/auth", require("../routes/auth/auth.routes.js"));

  // Base URLS
  app.use("/", require("../routes/index.routes.js"));
};
