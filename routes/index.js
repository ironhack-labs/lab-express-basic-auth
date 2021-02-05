module.exports = (app) => {
  // Base URLS
  app.use("/", require("../routes/index.routes.js"));

  // Custom URLS
  app.use("/auth", require("../routes/auth/auth.routes.js"));
};
